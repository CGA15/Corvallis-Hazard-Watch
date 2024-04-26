// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import DataView from './DataView/DataView';
import styled from "@emotion/styled";
import { useDispatch } from 'react-redux'

import { fetchData} from './redux/storeSlice'

//In order to add new pages, make new routes. and new Links
const App = () => {
  const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(fetchData());
    },[dispatch])

  const NavHeader = styled.h1`
    display: flex
  `
  const LinkContainer = styled.div`
  margin-right: 1em;
  border-style: solid;
  border-radius: 18px;
  width: fit-content;
  background: lightslategrey;
  `
  return (
    <Router>
    <div>
      <nav className='navBar'>
        <NavHeader>
          <LinkContainer><Link to="/map">Map</Link></LinkContainer>
          <LinkContainer><Link to="/dataView">Data View</Link></LinkContainer>
        </NavHeader>
      </nav>

      <Routes>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:lat/:lon/:time" element = {<MapPage />}/>
        <Route path="/dataView" element={<DataView/>}/>
      </Routes>
    </div>
  </Router>
  );
};

export default App;
