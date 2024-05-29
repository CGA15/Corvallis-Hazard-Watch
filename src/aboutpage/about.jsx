import React from 'react';
import map from '../components/mapillustration.png';
import { Container, Info, LandingPage } from '../components/styled/Container';
import { TeamContainer } from '../components/styled/Image';
import { Button } from '../components/styled/Button';
import { ButtonLink } from '../components/styled/Link';
import GlobalStyle from '../components/styled/Globalstyle';
import teamImage from '../components/teamPic.jpg'


const About = () => {
    return (
    <>
       <GlobalStyle/>
        <html>
            <body>
            <Container>
                <Info>
                <h1>About Us</h1>
                    <section>
                    <h2>Our Mission</h2>
                    <p>
                        At HazardWatch, we prioritize your safety by providing real-time updates on local hazards. 
                        <br/>Our goal is to help you and your loved ones stay informed and prepared for any potential threats in your area.
                        <br/>National and Local alert systems often miss hazards and are succeptible to delay.
                        <br/>We set out to fix this using help from millions keen-eyed people like yourself to provide a trustworthy, constantly updated map of hazard alerts.
                    </p>
                    </section>
                    
                    <h1>Development Team</h1>
                <TeamContainer>
                    <img src={teamImage} alt="Team" />
                </TeamContainer>
                <section>
                <a href="https://github.com/CGA15/Corvallis-Hazard-Watch"><h2>GitHub</h2></a>
                <a href="https://github.com/CGA15/Corvallis-Hazard-Watch"><p>https://github.com/CGA15/Corvallis-Hazard-Watch"</p></a>
                <h2>Contact Information</h2>
                <p>Email: corvallis-hazardwatch@proton.me</p>
                <p>Address: 123 Safe Street, Safety City, Safe Country</p>
                <p><b>**The above address info is a placeholder values because website is still under construction**</b></p>
                </section>
            </Info>
            </Container>
            </body>
        </html>
        </>
      );
    };


export default About