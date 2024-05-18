// src/homepage/home.jsx
import React from 'react';
import map from '../components/mapillustration.png';
import { Container, Info, LandingPage } from '../components/styled/Container';
import { ImageContainer } from '../components/styled/Image';
import { Button } from '../components/styled/Button';
import { ButtonLink } from '../components/styled/Link';

const Home = () => {
  return (
    <LandingPage>
      <div className="content">
        <Container>
          <Info>
            <h1>Stay Informed on Local Hazards</h1><br/>
            <p><strong>Do you value your safety?</strong><br/> <strong>Want to help your loved ones and your community stay safe?</strong><br/> <br/> We've got you covered, stay up to date and reports hazard in your area with HazardWatch!</p>
            <Button><a href="/map">View Map</a></Button>
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
