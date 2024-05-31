// src/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle `
 

  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');



  <meta name="viewport" content="width=device-width" />
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');


  *, *::before, *::after {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    overflow-x: hidden; 
  }

  html, body {
    font-family: "Ubuntu", sans-serif;
    background-color: #FAFAFA;
    color: #5d5d5d;
    overflowY: 'scroll';
    overflowX: 'hidden';
  }


  


  strong{
    font-family: "Playfair Display", serif;
    font-weight: 700;
    font-size: 1.8em; 
    color: #DC4405; 
    font-weight: bold; 
    // background-color: #FFF3E0; 
    // padding: 2px;
    // border-radius: 2px;
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