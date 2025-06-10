import './App.css';
import InvoiceList from './components/InvoiceList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Invoice App</h1>
      </header>
      <main>
        <InvoiceList />
      </main>
    </div>
  );
}

export default App;
