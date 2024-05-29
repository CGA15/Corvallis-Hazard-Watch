// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import hazardlogo from './components/logo.png';
import MapPage from './MapPage/MapPage'; // Adjust the import path as needed
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './components/NavBar';


import DataView from './DataView/DataView';
import styled from "@emotion/styled";
import { useDispatch } from 'react-redux'
import Home from './homepage/home'
import About from './aboutpage/about'



import { fetchData} from './redux/storeSlice'
import { fetchIcons } from './redux/iconSlice';
import { fetchTypes } from './redux/hazTypesRedux';


import GlobalStyle from './components/styled/Globalstyle.js';
import { Header, LogoMini, Nav } from './components/styled/Header';
import { Container, Info, LandingPage } from './components/styled/Container';
import { ImageContainer } from './components/styled/Image';
import { Button } from './components/styled/Button';
import { StyledLink, ButtonLink } from './components/styled/Link.js';
import { fetchSensor } from './redux/sensorSlice.js';


//In order to add new pages, make new routes. and new Links
const App = () => {
  const { isLoading, error } = useAuth0();

  const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(fetchIcons());
        dispatch(fetchTypes());
        dispatch(fetchData());
        dispatch(fetchSensor())
        
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

  
  /*if (isLoading) {
    return <div>Loading...</div>;
  }*/

  return (
    
    <Router>  
        <GlobalStyle/>
        <Header>
          <Link to="/">
            <LogoMini src={hazardlogo} alt="Hazard Logo" />
          </Link>          
          <NavBar />
        </Header>


  <main style={{ marginTop: '100px' }}>
      <Routes>
        <Route path ="/" element={<Home/>}></Route>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:lat/:lon/:time" element = {<MapPage />}/>
        <Route path="/dataView" element={<DataView/>}/>
        <Route path="/about" element={<About />} />
      </Routes>
    
    </main>

  </Router>

  );
};

export default App;




