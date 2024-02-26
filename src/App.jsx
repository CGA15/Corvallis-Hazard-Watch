// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
//In order to add new pages, make new routes. and new Links
const App = () => {
  return (
    <Router>
    <div>
      <nav className='navBar'>
        <h1>
          <Link to="/map">Map</Link>
        </h1>
      </nav>

      <Routes>
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </div>
  </Router>
  );
};

export default App;
