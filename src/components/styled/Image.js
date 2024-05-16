// src/components/styled/Image.js
import styled from 'styled-components';

export const ImageContainer = styled.div `
  margin-left: auto;
  align-self: center;
  flex-grow: 0;

  img {
    max-height: 80vh;
    width: auto;
    height: auto;
    margin-left: auto;
    display: block;
  }
`;