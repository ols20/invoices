import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './InvoiceDetails.css';

const TERMS_TEXT = `By submitting a refund request, you acknowledge that your request will be reviewed according to our refund policy. Refunds are subject to approval and may take up to 14 business days to process.`;

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundTermsAccepted, setRefundTermsAccepted] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const [refundTrackReference, setRefundTrackReference] = useState("");
  const [refundTrackedRequest, setRefundTrackedRequest] = useState(null);
  const [refundTrackError, setRefundTrackError] = useState("");
  const [lastRefundStatus, setLastRefundStatus] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/invoices/${id}`)
      .then(response => setInvoice(response.data))
      .catch(() => setError('Invoice not found or an error occurred.'));
  }, [id]);

  // Open refund modal if ?refund=1 in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('refund') === '1') {
      setShowRefundModal(true);
    }
  }, [location.search]);

  // Poll for status changes if tracking
  useEffect(() => {
    let interval;
    if (refundTrackedRequest && refundTrackedRequest.reference) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/invoices/refund-request/${refundTrackedRequest.reference}`);
          if (res.data.status !== lastRefundStatus) {
            setRefundTrackedRequest(res.data);
            setLastRefundStatus(res.data.status);
            alert(`Refund status changed: ${res.data.status}`);
          }
        } catch {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [refundTrackedRequest, lastRefundStatus]);

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

  const handleRefundRequest = async (e) => {
    e.preventDefault();
    if (!refundReason.trim()) {
      setRefundMessage("Please provide a reason for your refund request.");
      return;
    }
    if (!refundTermsAccepted) {
      setRefundMessage("You must accept the terms and conditions.");
      return;
    }
    try {
      const payload = { ...invoice, refundReason };
      const response = await axios.post('http://localhost:8080/api/invoices/request-refund', payload);
      setRefundMessage(response.data?.message || response.data || "Refund request submitted!");
    } catch (err) {
      setRefundMessage("Error submitting refund request.");
    }
  };

  const handleTrackRefund = async (e) => {
    e.preventDefault();
    setRefundTrackError("");
    setRefundTrackedRequest(null);
    try {
      const res = await axios.get(`http://localhost:8080/api/invoices/refund-request/${refundTrackReference}`);
      setRefundTrackedRequest(res.data);
      setLastRefundStatus(res.data.status);
    } catch {
      setRefundTrackError("Refund request not found. Check your reference number.");
    }
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
        <button className="refund-button" onClick={() => { setShowRefundModal(true); setRefundMessage(""); }}>Request Full Refund</button>
      </div>
      {showRefundModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request Full Refund</h3>
            <form onSubmit={handleRefundRequest}>
              <label>
                Reason for refund:
                <textarea
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  required
                  style={{ width: '100%', minHeight: '60px', marginTop: '8px' }}
                />
              </label>
              <div className="terms-box">
                <input
                  type="checkbox"
                  id="refund-terms"
                  checked={refundTermsAccepted}
                  onChange={e => setRefundTermsAccepted(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="refund-terms">I accept the terms and conditions</label>
                <div className="terms-text">{TERMS_TEXT}</div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button type="submit" className="action-button">Submit Refund Request</button>
                <button type="button" className="action-button cancel" onClick={() => setShowRefundModal(false)} style={{ marginLeft: '10px' }}>Cancel</button>
              </div>
              {refundMessage && <div style={{ color: refundMessage.startsWith('Error') ? 'red' : 'green', marginTop: '10px', textAlign: 'center' }}>{refundMessage}</div>}
            </form>
            <hr style={{margin: '24px 0 16px 0'}} />
            <h4>Track Refund Status</h4>
            <form onSubmit={handleTrackRefund} style={{marginBottom: '10px'}}>
              <input
                type="text"
                placeholder="Enter refund reference number"
                value={refundTrackReference}
                onChange={e => setRefundTrackReference(e.target.value)}
                style={{width: '100%', marginBottom: '8px'}}
              />
              <button type="submit" className="action-button">Track Status</button>
            </form>
            {refundTrackError && <div style={{color:'red', marginBottom:'8px'}}>{refundTrackError}</div>}
            {refundTrackedRequest && (
              <div style={{background:'#f7f7f7', borderRadius:'6px', padding:'12px', marginTop:'8px'}}>
                <div><b>Reference:</b> {refundTrackedRequest.reference}</div>
                <div><b>Status:</b> {refundTrackedRequest.status}</div>
                <div><b>Reason:</b> {refundTrackedRequest.reason || <span style={{color:'#888'}}>—</span>}</div>
                <div><b>Requested:</b> {new Date(refundTrackedRequest.createdAt).toLocaleString()}</div>
                <div><b>Estimated processing time:</b> 14 business days</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;