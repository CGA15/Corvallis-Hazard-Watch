import React, { useState } from "react";
import { StyledLink, ButtonLink } from './components/styled/Link.js';
import { Nav } from './components/styled/Header';



import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  return (
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
            <li>
              <StyledLink to="/about" title="About">About</StyledLink>
            </li>
            {!isAuthenticated && (
                    
                    <Button onClick={() => loginWithRedirect()}>
                        Log in
                    </Button>
                    
            )}
            {isAuthenticated && (
              <>
                <img
                src={user.picture}
                alt="Profile"
                width="50" />
                <Button onClick={() => logoutWithRedirect()}>
                  Logout
                </Button>
              </>      
            )}
        </ul>
    </Nav>
  );
};

export default NavBar;

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
                <li>
                  <StyledLink to="/about" title="About">About</StyledLink>
                </li>
                <li className="login">
                  <ButtonLink to="/login" className="btn" title="Register/Sign-In"><span className="loginbtn">Login</span></ButtonLink>
                </li>
              </ul>
            </Nav>*/