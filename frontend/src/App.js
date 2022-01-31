import './App.css';
import MovieList from './components/MovieList';
import AddMovie from './components/AddMovie';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element ={<MovieList/>} />
            <Route path="/AddMovie" element ={<AddMovie/>} />
            <Route path="/AddMovie/:id" element ={<AddMovie/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
