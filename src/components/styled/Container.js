// src/components/styled/Container.js
import styled from 'styled-components';

export const Container = styled.div `
  // margin-top: 100px;
   margin-left: 10vw;
  // width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0px;
  padding-right: 50px;

  
  padding-top: 30px;
  justify-content: space-between;
  width: 90%;
`;



export const Info = styled.div `
  paddingTop: 50px;
  flex-grow: 1;
  margin-right: 25px;
  paddingBottom: 20px;

  h1 {
    font-size: 50px;
    marginBottom: 50px;
  }
`;

export const LandingPage = styled.div `
  overflow: 'hidden';
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