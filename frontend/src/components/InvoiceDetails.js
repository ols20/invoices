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
      
      <ul>
        {invoice.lineItems?.map((item, index) => (
          <li key={index} className="field">
            <strong>{item.description}</strong>
            <span>${item.cost.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="invoice-actions">
        <button onClick={() => console.log('Download invoice:', invoice.id)}>Download</button>
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default InvoiceDetails;