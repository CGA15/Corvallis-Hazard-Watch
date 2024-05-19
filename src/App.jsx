// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import Login from './pages/Login'
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './components/NavBar';

import DataView from './DataView/DataView';
import styled from "@emotion/styled";
import { useDispatch } from 'react-redux'


import { fetchData} from './redux/storeSlice'
import { fetchIcons } from './redux/iconSlice';
import { fetchTypes } from './redux/hazTypesRedux';





//In order to add new pages, make new routes. and new Links
const App = () => {
  const { isLoading, error } = useAuth0();

  const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(fetchIcons());
        dispatch(fetchTypes());
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

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    
    <Router>  
          <NavBar />

  <main style={{ marginTop: '100px' }}>
      <Routes>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:lat/:lon/:time" element = {<MapPage />}/>
        <Route path="/dataView" element={<DataView/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    
    </main>
    
  </Router>

  );
};

export default App;




