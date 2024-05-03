// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import Login from './pages/Login'
import { Auth0Provider } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './auth0Provider';
//In order to add new pages, make new routes. and new Links
const App = () => {
  return (
    
      <Router>
        <Auth0ProviderWithHistory>
      <div>
        <nav className='navBar'>
          <h1>
            <Link to="/map">Map</Link>
            <Link to="/Login">Login</Link>
          </h1>
        </nav>

        <Routes>
          <Route path="/map" element={<MapPage />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
      </Auth0ProviderWithHistory>
    </Router>

  );
};

export default App;




