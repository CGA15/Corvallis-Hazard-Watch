import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)
`
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
`;

export const ButtonLink = styled(Link)
`
  border-radius: 20px;
  padding: 10px 20px;
  color: #FFF;
  background-color: #DC4405;
  cursor: pointer;

  &:hover {
    border-radius: 20px;
    padding: 15px 25px;
  }
`;