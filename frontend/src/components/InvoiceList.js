import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/invoices')
      .then(response => setInvoices(response.data))
      .catch(error => console.error('Error fetching invoices:', error));
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Update sorting logic to handle numeric sort for 'id'
  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortConfig.key === 'id') {
      // Numeric sort for id
      return (parseInt(a.id) - parseInt(b.id)) * (sortConfig.direction === 'asc' ? 1 : -1);
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(invoices.length / itemsPerPage);

  // Helper to format amount with spaces as thousand separators
  function formatAmount(amount) {
    if (typeof amount !== 'number') return '';
    return '$ ' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  return (
    <div className="invoice-list-container">
      <h1 className="invoice-list-title">Invoice List</h1>
      <table className="invoice-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('description')}>
              Name {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('date')}>
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('totalAmount')}>
              Total Amount {sortConfig.key === 'totalAmount' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.description}</td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td>{formatAmount(invoice.amount || 0)}</td>
              <td>{invoice.status || 'Unknown'}</td>
              <td>
                <button
                  className="action-button"
                  onClick={() => navigate(`/invoice/${invoice.id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InvoiceList;
