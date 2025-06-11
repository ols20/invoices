import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceList from './components/InvoiceList';
import InvoiceDetails from './components/InvoiceDetails';
import invoiceIcon from './invoice-icon.svg';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src={invoiceIcon} alt="Invoice Icon" style={{ width: 40, height: 40, verticalAlign: 'middle' }} />
            <h1 style={{ margin: 0 }}>Invoice App</h1>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
