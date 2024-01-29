import MultiSelect from "./components/multiselect";
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Multi Select Component</h1>
        <p>Multi Select Component with custom debouncing hook. </p>
      </header>
      <div className="search-container">
        <MultiSelect
          fetchUrl="https://dummyjson.com/users/search"
          placeholder="Search User..."
        />
      </div>
    </div>
  );
}

export default App;