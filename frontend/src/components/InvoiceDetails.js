import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InvoiceDetails.css';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/invoices/${id}`)
      .then(response => setInvoice(response.data))
      .catch(() => setError('Invoice not found or an error occurred.'));
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!invoice) {
    return <p>Loading...</p>;
  }

  return (
    <div className="invoice-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <span style={{ marginRight: '6px' }}>&larr;</span>Back
      </button>
      <h2>Invoice Details</h2>
      <div className="field">
        <strong>Invoice Number:</strong>
        <span>{invoice.id}</span>
      </div>
      <div className="field">
        <strong>Date:</strong>
        <span>{new Date(invoice.date).toLocaleDateString()}</span>
      </div>
      <div className="field">
        <strong>Total Amount:</strong>
        <span>${invoice.amount.toFixed(2)}</span>
      </div>
      <div className="field">
        <strong>Status:</strong>
        <span>{invoice.status}</span>
      </div>

      <h3 style={{textAlign: 'center', margin: '20px 0 10px 0'}}>Line Items</h3>
      <table className="line-items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{textAlign: 'right'}}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems && invoice.lineItems.length > 0 ? (
            invoice.lineItems.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td style={{textAlign: 'right'}}>${item.cost.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={2} style={{textAlign: 'center'}}>No line items</td></tr>
          )}
        </tbody>
      </table>

      <div className="invoice-actions">
        <button onClick={() => console.log('Download invoice:', invoice.id)}>Download</button>
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default InvoiceDetails;