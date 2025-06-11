import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceList from './components/InvoiceList';
import InvoiceDetails from './components/InvoiceDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Invoice App</h1>
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
