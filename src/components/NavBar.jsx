import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";


import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

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
            {!isAuthenticated && (
                    <NavItem>
                    <Button
                        id="qsLoginBtn"
                        color="primary"
                        className="btn-margin"
                        onClick={() => loginWithRedirect()}
                    >
                        Log in
                    </Button>
                    </NavItem>
            )}
            {isAuthenticated && (
                    <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret id="profileDropDown">
                        <img
                        src={user.picture}
                        alt="Profile"
                        className="nav-user-profile rounded-circle"
                        width="50"
                        />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>{user.name}</DropdownItem>
                        <DropdownItem
                        tag={RouterNavLink}
                        to="/profile"
                        className="dropdown-profile"
                        activeClassName="router-link-exact-active"
                        >
                         Profile
                        </DropdownItem>
                        <DropdownItem
                        id="qsLogoutBtn"
                        onClick={() => logoutWithRedirect()}
                        > Logout
                        </DropdownItem>
                    </DropdownMenu>
                    </UncontrolledDropdown>
            )}
            <li className="login">
                <ButtonLink to="/login" className="btn" title="Register/Sign-In">Register/Sign-In</ButtonLink>
            </li>
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
  <li className="login">
    <ButtonLink to="/login" className="btn" title="Register/Sign-In">Register/Sign-In</ButtonLink>
  </li>
</ul>
</Nav>*/