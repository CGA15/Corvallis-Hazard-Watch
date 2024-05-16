// src/components/styled/Container.js
import styled from 'styled-components';

export const Container = styled.div `
  margin-top: 100px;
  margin-left: 10vw;
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0px;
  padding-right: 75px;
  padding-top: 30px;
  justify-content: space-between;
  width: 90%;
`;

export const Info = styled.div `
  flex-grow: 1;
  padding-bottom: 20px;
  margin-right: 10px;

  h1 {
    font-size: 50px;
  }
`;

export const LandingPage = styled.div `
  .content {
    .container {
      .info {
        h1 {
          font-size: 50px;
        }
      }
    }
  }
`;