import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InvoiceDetails.css';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [changeRequests, setChangeRequests] = useState({});
  const [reason, setReason] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [trackReference, setTrackReference] = useState("");
  const [trackedRequest, setTrackedRequest] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [expandedLines, setExpandedLines] = useState([]);
  const [submittedLineData, setSubmittedLineData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8080/api/invoices/${id}`)
      .then(response => setInvoice(response.data))
      .catch(() => setError('Invoice not found or an error occurred.'));
  }, [id]);

  const handleSelectItem = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleChangeRequest = (index, value) => {
    setChangeRequests((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmitChangeRequest = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setSubmitMessage("Select at least one line item.");
      return;
    }
    if (!reason.trim()) {
      setSubmitMessage("Please provide a reason for your request.");
      return;
    }
    const items = selectedItems.map((i) => ({
      description: invoice.lineItems[i].description,
      cost: invoice.lineItems[i].cost,
      requestedChange: changeRequests[i] || ""
    }));
    const payload = {
      invoiceId: invoice.id,
      items,
      reason
    };
    try {
      const response = await axios.post('http://localhost:8080/api/invoices/request-change', payload);
      setSubmitMessage(`Change request submitted! Reference: ${response.data.reference}`);
      // Save submitted data only for selected lines
      const now = new Date();
      setSubmittedLineData((prev) => {
        const updated = { ...prev };
        selectedItems.forEach(i => {
          updated[i] = {
            reference: response.data.reference,
            submitted: now,
            requestedChange: changeRequests[i] || "",
            reason,
            status: "pending"
          };
        });
        return updated;
      });
    } catch (err) {
      setSubmitMessage("Error submitting request.");
    }
  };

  const handleToggleExpandLine = (index) => {
    setExpandedLines((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

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
      <form onSubmit={handleSubmitChangeRequest} className="change-request-form">
        <table className="line-items-table">
          <thead>
            <tr>
              <th></th>
              <th>Description</th>
              <th style={{textAlign: 'right'}}>Cost</th>
              <th>Requested Change</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems && invoice.lineItems.length > 0 ? (
              invoice.lineItems.map((item, index) => (
                <React.Fragment key={index}>
                  <tr
                    onClick={() => submittedLineData[index] && handleToggleExpandLine(index)}
                    style={{ cursor: submittedLineData[index] ? 'pointer' : 'default', background: expandedLines.includes(index) ? '#f5f7fa' : undefined }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={e => { e.stopPropagation(); handleSelectItem(index); }}
                      />
                    </td>
                    <td>{item.description}</td>
                    <td style={{textAlign: 'right'}}>${item.cost.toFixed(2)}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Describe requested change"
                        value={changeRequests[index] || ""}
                        onChange={e => handleChangeRequest(index, e.target.value)}
                        disabled={!selectedItems.includes(index)}
                        style={{width: '100%'}}
                        onClick={e => e.stopPropagation()}
                      />
                    </td>
                  </tr>
                  {expandedLines.includes(index) && submittedLineData[index] && (
                    <tr className="expand-row">
                      <td colSpan={4}>
                        <div style={{padding: '10px 0 0 0'}}>
                          <div><b>Reference number:</b> {submittedLineData[index].reference}</div>
                          <div><b>Submitted:</b> {submittedLineData[index].submitted.toLocaleString()}</div>
                          <div><b>Status:</b> {submittedLineData[index].status}</div>
                          <div><b>Requested Change:</b> {submittedLineData[index].requestedChange || <span style={{color:'#888'}}>—</span>}</div>
                          <div><b>Reason:</b> {submittedLineData[index].reason || <span style={{color:'#888'}}>—</span>}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr><td colSpan={4} style={{textAlign: 'center'}}>No line items</td></tr>
            )}
          </tbody>
        </table>
        <div style={{margin: '20px 0', textAlign: 'center'}}>
          <textarea
            placeholder="Reason/justification for change request"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{width: '60%', minHeight: '60px'}}
          />
        </div>
        <div style={{textAlign: 'center', marginBottom: '10px'}}>
          <button type="submit" className="action-button">Submit Change Request</button>
        </div>
        {submitMessage && <div style={{textAlign: 'center', color: 'green'}}>{submitMessage}</div>}
      </form>

      <div className="invoice-actions">
        <button onClick={() => console.log('Download invoice:', invoice.id)}>Download</button>
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default InvoiceDetails;