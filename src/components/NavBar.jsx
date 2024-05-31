import React, { useState } from "react";
import { StyledLink, ButtonLink } from './styled/Link.js';
import { Nav } from './styled/Header';



import { useAuth0 } from "@auth0/auth0-react";
import GlobalStyle from "./styled/Globalstyle.js";

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
    <>
    <GlobalStyle/>
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
              <li>
              <ButtonLink onClick={() => loginWithRedirect()}>
                Log in
              </ButtonLink> 
              </li>     
            )}
            {isAuthenticated && (
              <>
                <li>
                <ButtonLink onClick={() => logoutWithRedirect()}>
                  Logout
                </ButtonLink>
                </li>
              </>      
            )}
        </ul>
    </Nav>
    </>
  );
};

export default NavBar;
