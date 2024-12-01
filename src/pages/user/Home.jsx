import React from 'react';
import {Button, Col, Layout, Row, Typography} from 'antd';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import LayoutComponent from "../../widgets/LayoutComponent.jsx";

const {Content} = Layout;
const {Title, Paragraph} = Typography;

// Styled Components
const LargeTitle = styled(Title)`
  font-size: 7.5em;
  color: white;
`;

const LargeButton = styled(Button)`
  font-size: 1.2em;
  padding: 10px 20px;
  margin: 0 5px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
`;

const HeroSection = styled.div`
  background-image: url('http://localhost:9000/images/home.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const TextOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  padding: 20px;
  border-radius: 10px;
  text-align: center; /* Center text within the overlay */
`;


const Home = () => {
    return (
        <LayoutComponent>
            <Content>
                <HeroSection>
                    <TextOverlay> {/* Wrap text content in the overlay */}
                        <LargeTitle style={{color: "white"}} level={1}>Welcome to our medical center!</LargeTitle>
                        <Paragraph style={{fontSize: '1.5em', color: 'white'}}>
                            We offer a wide range of medical services for the whole family.
                        </Paragraph>
                        <Row justify="center" style={{marginTop: '20px'}}>
                            <Col>
                                <Link to="/doctors">
                                    <LargeButton type="primary">Our Doctors</LargeButton>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/services">
                                    <LargeButton type="primary">Our Services</LargeButton>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/about">
                                    <LargeButton type="primary">About Us</LargeButton>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/contacts ">
                                    <LargeButton type="primary">Contacts</LargeButton>
                                </Link>
                            </Col>
                        </Row>
                    </TextOverlay>
                </HeroSection>
            </Content>
        </LayoutComponent>
    );
};

export default Home;