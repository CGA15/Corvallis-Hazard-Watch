// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import hazardlogo from './components/logo.png';
import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import Login from './pages/Login'
//import Auth0Provider  from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './Auth0Provider';
import DataView from './DataView/DataView';
import styled from "@emotion/styled";
import { useDispatch } from 'react-redux'
import Home from './homepage/home'

import { fetchData} from './redux/storeSlice'
import { fetchIcons } from './redux/iconSlice';
import { fetchTypes } from './redux/hazTypesRedux';

import GlobalStyle from './components/styled/Globalstyle.js';
import { Header, LogoMini, Nav } from './components/styled/Header';
import { Container, Info, LandingPage } from './components/styled/Container';
import { ImageContainer } from './components/styled/Image';
import { Button } from './components/styled/Button';
import { StyledLink, ButtonLink } from './components/styled/Link.js';

//In order to add new pages, make new routes. and new Links
const App = () => {
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
    <GlobalStyle />
        <Header>
          <LogoMini src={hazardlogo} alt="Hazard Logo" />
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
        </Header>

  <main style={{ marginTop: '100px' }}>
      <Routes>
        <Route path ="/" element={<Home/>}></Route>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:lat/:lon/:time" element = {<MapPage />}/>
        <Route path="/dataView" element={<DataView/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    
    </main>
    </Auth0ProviderWithHistory>
  </Router>

  );
};

export default App;




