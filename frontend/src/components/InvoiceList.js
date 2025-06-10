import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/invoices')
      .then(response => setInvoices(response.data))
      .catch(error => console.error('Error fetching invoices:', error));
  }, []);

  return (
    <div className="invoice-list">
      <h1>Invoice List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.description}</td>
              <td>{new Date().toLocaleDateString()}</td>
              <td>Pending</td>
              <td><button>Add Description</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
