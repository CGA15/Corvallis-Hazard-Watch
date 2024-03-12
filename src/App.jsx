// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import { useDispatch } from 'react-redux'

import { fetchData} from './redux/storeSlice'

//In order to add new pages, make new routes. and new Links
const App = () => {
  const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(fetchData());
    },[dispatch])
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
