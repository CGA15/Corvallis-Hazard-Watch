// src/homepage/home.jsx
import React from 'react';
import map from '../components/mapillustration.png';
import { Container, Info, LandingPage } from '../components/styled/Container';
import { ImageContainer } from '../components/styled/Image';
import { Button } from '../components/styled/Button';

const Home = () => {
  return (
    <LandingPage>
      <div className="content">
        <Container>
          <Info>
            <h1>Stay Informed on Local Hazards</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus odit nihil ullam nesciunt quidem iste, Repellendus odit nihil</p>
            <Button>View Map</Button>
          </Info>
          <ImageContainer>
            <img src={map} alt="Map Illustration" />
          </ImageContainer>
        </Container>
      </div>
    </LandingPage>
  );
};

export default Home;
