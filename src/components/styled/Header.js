// src/components/styled/Header.js
import styled from 'styled-components';
import { StyledLink, ButtonLink } from './Link'

export const Header = styled.header `
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px 0;
  margin-bottom: 50px;
`;

export const Links = styled.nav `
  display: flex;

  li {
    &.start {
      padding-right: 20vw;
    }

    &.btn {
      border-radius: 20px;
      padding: 10px 20px;
      color: #FFF;
      background-color: #DC4405;
      cursor: pointer;

      &:hover {
        border-radius: 20px;
        padding: 15px 25px;
      }
    }

    a {
      font-size: large;
      margin: 0px 75px 0px 0px;
      color: #5d5d5d;
      cursor: pointer;
      transition: .3s;
      font-weight: 500;

      &:not(.btn):hover {
        color: #DC4405;
        border-radius: 20px;
        padding: 10px 20px;
        color: #FFF;
        background-color: #DC4405;
      }
    }
  }
`;


export const LogoMini = styled.img `
  height: auto;
  width: auto;
  max-width: 300px;
  max-height: 300px;
`;

export const Nav = styled.nav `
  .links {
    display: flex;

    li {
      &.start {
        padding-right: 20vw;
      }

      &.btn {
        border-radius: 20px;
        padding: 10px 20px;
        color: #FFF;
        background-color: #DC4405;
        cursor: pointer;

        &:hover {
          border-radius: 20px;
          padding: 15px 25px;
        }
      }

      a, ${StyledLink}, ${ButtonLink} {
        font-size: large;
        margin: 0px 75px 0px 0px;
        color: #5d5d5d;
        cursor: pointer;
        transition: .3s;
        font-weight: 500;

        &:not(.btn):hover {
          color: #DC4405;
          border-radius: 20px;
          padding: 10px 20px;
          background-color: #DC4405;
        }
      }
    }
  }
`;