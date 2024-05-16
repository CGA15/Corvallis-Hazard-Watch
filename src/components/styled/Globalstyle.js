// src/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle `
 
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

  body {
    font-family: "Ubuntu", sans-serif;
    background-color: #FAFAFA;
    color: #5d5d5d;
    overflow: hidden;
  }

  ul,
  nav {
    list-style: none;
    padding: 0;
    border-bottom: black;
  }

  a {
    text-decoration: none;
  }
`;


export default GlobalStyle;