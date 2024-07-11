import React from 'react';
import './App.css';
import Home from './components/Home.js';
import Saved from "./components/Saved";
import PreviouslyViewed from './components/PreviouslyViewed.js';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/saved" element={<Saved/>} />
          <Route path="/viewed" element={<PreviouslyViewed/>} />
        </Routes>
    </Router>
  );
}

export default App;
