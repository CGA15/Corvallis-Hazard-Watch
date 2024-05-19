import React, { useState } from "react";
import { StyledLink, ButtonLink } from './styled/Link.js';
import { Nav } from './styled/Header';



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
              <ButtonLink onClick={() => loginWithRedirect()}>
                Log in
              </ButtonLink>      
            )}
            {isAuthenticated && (
              <>
                
                <ButtonLink onClick={() => logoutWithRedirect()}>
                  Logout
                </ButtonLink>
              </>      
            )}
        </ul>
    </Nav>
  );
};

export default NavBar;

/*
<img
src={user.picture}
alt="Profile"
width="50" />*/