import logo from './logo.svg';
import './App.css';
import './components/SearchBar';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SearchBar />
      </header>
    </div>
  );
}

export default App;
