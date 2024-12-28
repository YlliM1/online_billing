import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
    display: 'table',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    padding: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
    padding: 5,
  },
});

const OfferPDF = ({ offer }) => {
  const { project, client, email, offer_date, due_date, client_address, items } = offer;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Offer Details</Text>
          <Text style={styles.text}>Project: {project}</Text>
          <Text style={styles.text}>Client: {client}</Text>
          <Text style={styles.text}>Email: {email}</Text>
          <Text style={styles.text}>Offer Date: {offer_date}</Text>
          <Text style={styles.text}>Due Date: {due_date}</Text>
          <Text style={styles.text}>Client Address: {client_address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Items</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
              <Text style={styles.tableCell}>Item</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Price</Text>
            </View>
            {items.map((item, index) => {
              const price = !isNaN(parseFloat(item.price)) ? parseFloat(item.price) : 0; 
              return (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>${price.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OfferPDF;
