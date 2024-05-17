// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import Login from './pages/Login'
import { Auth0Provider } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './auth0Provider';
import DataView from './DataView/DataView';
import styled from "@emotion/styled";
import { useDispatch } from 'react-redux'
import { withAuth0 } from "@auth0/auth0-react";

import { fetchData} from './redux/storeSlice'
import { fetchIcons } from './redux/iconSlice';
import { fetchTypes } from './redux/hazTypesRedux';

//In order to add new pages, make new routes. and new Links
const App = () => {
  const { isLoading } = withAuth0();

    if (isLoading) {
      return <Loading />;
    }

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
  return (

    <Router>
     <Auth0ProviderWithHistory>
    <div>
      <nav className='navBar'>
        <NavHeader>
          <LinkContainer><Link to="/map">Map</Link></LinkContainer>
          <LinkContainer><Link to="/dataView">Data View</Link></LinkContainer>
          <LinkContainer><Link to="/login">Login</Link></LinkContainer>
        </NavHeader>
      </nav>

      <Routes>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:lat/:lon/:time" element = {<MapPage />}/>
        <Route path="/dataView" element={<DataView/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    </Auth0ProviderWithHistory>
  </Router>

  );
};

export default App;

/*
            <Nav>
            <ul className="links">
              <li className="start">
                <StyledLink to="/" title="Home">Home</StyledLink>
              </li>
              <li>
                <StyledLink to="/map" title="Map">Map</StyledLink>
              </li>
              <li>
                <StyledLink to="/dataView" className="dataView">DataView</StyledLink>
              </li>
              <li className="login">
                <ButtonLink to="/login" className="btn" title="Register/Sign-In">Register/Sign-In</ButtonLink>
              </li>
            </ul>
            </Nav>

*/




