import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaPen, FaTrashAlt, FaDownload } from 'react-icons/fa';  
import Navbar from '../../components/Navbar';
import OfferPDF from '../OfferPDF/OfferPDF';
import './Invoices.css';

const Invoices = () => {
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('offers');
  const [formData, setFormData] = useState({
    project: '',
    client: '',
    email: '',
    offer_date: '',
    due_date: '',
    client_address: '',
    items: [],
    status: 'pending', // Default status
  });
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editOfferId, setEditOfferId] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('user_role');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('user_role');
    const storedName = sessionStorage.getItem('user_name');
    const lastActivity = sessionStorage.getItem('last_activity');
    const now = new Date().getTime();
  
    if (storedName) {
      if (lastActivity && now - lastActivity > 45 * 60 * 1000) {
        alert('Session expired. Please log in again.');
        handleLogout();
      } else {
        setUserName(storedName);
        setUserRole(storedRole);
        sessionStorage.setItem('last_activity', now);
  
        if (!storedRole) {
          navigate('/login');
        }
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/online_billing/server/php/logout.php', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.clear();
        navigate('/login');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const renderActions = (offer) => {
    if (userRole === 'admin') {
      return (
        <div className="d-flex justify-content-center align-items-center">
          {/* Edit Icon (Pen) */}
          <button className="btn btn-link" onClick={() => handleEdit(offer)} style={{ color: 'blue' }}>
            <FaPen />
          </button>
  
          {/* Delete Icon (Trash) */}
          <button className="btn btn-link" onClick={() => handleDelete(offer.id)} style={{ color: 'red' }}>
            <FaTrashAlt />
          </button>
  
          {/* Download PDF Button - Positioned to the right */}
          <PDFDownloadLink
            document={<OfferPDF offer={offer} />}
            fileName={`offer_${offer.id}.pdf`}
            style={{
              textDecoration: 'none',
              color: '#007bff',
              fontWeight: 'bold',
              marginLeft: '20px', 
              display: 'inline-block',
            }}
          >
            {({ loading }) => (loading ? <FaDownload /> : 'Download PDF')}
          </PDFDownloadLink>
        </div>
      );
    }
    return null;
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems [index][field] = value;
    setFormData((prevData) => ({ ...prevData, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { name: '', quantity: 1, price: 0 }],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editMode 
        ? 'http://localhost/online_billing/server/php/edit_offer.php' 
        : 'http://localhost/online_billing/server/php/make_offers.php';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: editOfferId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(editMode ? 'Offer updated successfully!' : 'Offer created successfully!');
        resetForm();
        fetchInvoices();
      } else {
        alert('Failed to save the offer.');
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      project: '',
      client: '',
      email: '',
      offer_date: '',
      due_date: '',
      client_address: '',
      items: [],
      status: 'pending', // Reset status to default
    });
    setEditMode(false);
    setEditOfferId(null);
  };

  const fetchInvoices = async () => {
    try {
      let url = 'http://localhost/online_billing/server/php/fetch_offers.php';
      if (activeTab === 'pending') {
        url = 'http://localhost/online_billing/server/php/fetch_offers.php?status=pending';
      }
  
      console.log(`Fetching URL: ${url}`); // Debugging log
  
      const response = await fetch(url);
      const data = await response.json();
  
      console.log('Fetched data:', data); // Debugging log
  
      if (data.success) {
        const invoicesWithDecodedItems = data.data.map(offer => {
          let decodedItems = [];
          try {
            decodedItems = JSON.parse(offer.items);
          } catch (error) {
            decodedItems = offer.items ? [{ name: offer.items, quantity: 1, price: offer.price }] : [];
          }
          return {
            ...offer,
            items: decodedItems,
          };
        });
        setOffers(invoicesWithDecodedItems);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      alert('An error occurred while fetching invoices.');
    }
  };

  const handleEdit = (offer) => {
    setEditMode(true);
    setEditOfferId(offer.id);
    setFormData({
      project: offer.project,
      client: offer.client,
      email: offer.email,
      offer_date: offer.offer_date,
      due_date: offer.due_date,
      client_address: offer.client_address,
      items: offer.items,
      status: offer.status, // Set status from the offer being edited
    });
    setActiveTab('offers'); // Ensure the 'offers' tab is active
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm('Are you sure you want to delete this offer?');
    if (confirmation) {
      try {
        const response = await fetch('http://localhost/online_billing/server/php/delete_offer.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) {
          alert('Offer deleted successfully!');
          fetchInvoices();
        } else {
          alert('Failed to delete offer.');
        }
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('An error occurred while deleting the offer.');
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'invoices' || activeTab === 'pending') {
      fetchInvoices();
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <div className="invoices-offer-tab-content mt-4">
            <h2>{editMode ? 'Edit Offer' : 'Create Offer'}</h2>
            <form onSubmit={handleFormSubmit} className="invoices-offer-form">
              < div className="form-group">
                <label htmlFor="project">Project</label>
                <input
                  type="text"
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="client">Client</label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="offer_date">Offer Date</label>
                <input
                  type="date"
                  id="offer_date"
                  name="offer_date"
                  value={formData.offer_date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="client_address">Client Address</label>
                <textarea
                  id="client_address"
                  name="client_address"
                  value={formData.client_address}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <h4>Items</h4>
              {formData.items.map((item, index) => (
                <div key={index} className="form-group">
                  <div className="d-flex">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="form-control"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="form-control mx-2"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="form-control"
                      min="0"
                      required
                    />
                  </div>
                </div>
              ))}

              <button type="button" onClick={addItem} className="btn btn-secondary">
                Add Item
              </button>

              <div className="mt-3">
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update Offer' : 'Create Offer'}
                </button>
                {editMode && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary mx-2">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        );

      case 'invoices':
        return (
          <div className="mt-4">
            <h2>All Offers</h2>
            <table className="invoices-table table table-striped">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Offer Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <tr key={offer.id}>
                      <td>{offer.project}</td>
                      <td>{offer.client}</td>
                      <td>{offer.email}</td>
                      <td>{offer.offer_date}</td>
                      <td>{offer.due_date}</td>
                      <td>{offer.status}</td>
                      <td>
                        {renderActions(offer)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No offers available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'pending':
        return (
          <div className="mt-4">
            <h2>Pending Offers</h2>
            <table className="invoices-table table table-striped">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Offer Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.length > 0 ? (
                  offers.filter(offer => offer.status === 'pending').map((offer) => (
                    <tr key={offer.id}>
                      <td>{offer.project}</td>
                      <td>{offer.client}</td>
                      <td>{offer.email}</td>
                      <td>{offer.offer_date}</td>
                      <td>{offer.due_date}</td>
                      <td>{offer.status}</td>
                      <td>
                        {renderActions(offer)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No pending offers available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="mt-4">Please select a valid tab.</div>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="invoices-container">
        <h1>Invoices</h1>
        <div className="tabs">
          <button className={activeTab === 'offers' ? 'active' : ''} onClick={() => setActiveTab('offers')}>Offers</button>
          <button className={activeTab === 'invoices' ? 'active' : ''} onClick={() => setActiveTab('invoices')}>Invoices</button>
          <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pending</button>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Invoices;