import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
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
  });
  const [offers, setOffers] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = sessionStorage.getItem('user_name');
    const lastActivity = sessionStorage.getItem('last_activity');
    const now = new Date().getTime();

    if (storedName) {
      if (lastActivity && now - lastActivity > 45 * 60 * 1000) {
        alert('Session expired. Please log in again.');
        handleLogout();
      } else {
        setUserName(storedName);
        sessionStorage.setItem('last_activity', now);
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
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
      const response = await fetch('http://localhost/online_billing/server/php/make_offers.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Offer created successfully!');
        setFormData({
          project: '',
          client: '',
          email: '',
          offer_date: '',
          due_date: '',
          client_address: '',
          items: [],
        });
      } else {
        alert('Failed to create the offer.');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost/online_billing/server/php/fetch_offers.php');
      const data = await response.json();
  
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
  

  useEffect(() => {
    if (activeTab === 'invoices') {
      fetchInvoices();
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <div className="invoices-offer-tab-content mt-4">
            <h2>Create Offer</h2>
            <form onSubmit={handleFormSubmit} className="invoices-offer-form">
              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="project" className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="client" className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="client"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Client Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="offer_date" className="form-label">Offer Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="offer_date"
                    name="offer_date"
                    value={formData.offer_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="due_date" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="client_address" className="form-label">Client Address</label>
                  <textarea
                    className="form-control"
                    id="client_address"
                    name="client_address"
                    rows="3"
                    value={formData.client_address}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="invoices-items-section mb-3">
                <h4>Items</h4>
                {formData.items.map((item, index) => (
                  <div key={index} className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addItem}>
                  Add Item
                </button>
              </div>
              <button type="submit" className="btn btn-primary">Create Offer</button>
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
                      <td>
                        <PDFDownloadLink
                          document={<OfferPDF offer={offer} />}
                          fileName={`offer_${offer.id}.pdf`}
                          style={{
                            textDecoration: 'none',
                            color: '#007bff',
                            fontWeight: 'bold',
                          }}
                        >
                          Download PDF
                        </PDFDownloadLink>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No offers available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'pending':
        return <div className="mt-4">Pending Content</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar userName={userName} handleLogout={handleLogout} />
      <div className="invoices-container mt-4">
        <div className="invoices-tabs mb-3">
          <button
            className={`invoices-tab-btn invoices-offers ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            Offers
          </button>
          <button
            className={`invoices-tab-btn invoices-invoices ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            className={`invoices-tab-btn invoices-pending ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>
        <div className="invoices-tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Invoices;
