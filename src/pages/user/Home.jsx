import React from 'react';
import {Button, Col, Layout, Row, Typography} from 'antd';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import LayoutComponent from "../../widgets/LayoutComponent.jsx";

const {Content} = Layout;
const {Title, Paragraph} = Typography;

// Стилизованные компоненты
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
    background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный черный фон */
    padding: 20px;
    border-radius: 10px;
    text-align: center; /* Выравнивание текста по центру */
`;


const Home = () => {
    return (
        <LayoutComponent>
            <Content>
                <HeroSection>
                    <TextOverlay> {/* Обертка для текстового содержимого */}
                        <LargeTitle style={{color: "white"}} level={1}>Добро пожаловать в наш медицинский
                            центр!</LargeTitle>
                        <Paragraph style={{fontSize: '1.5em', color: 'white'}}>
                            Мы предлагаем широкий спектр медицинских услуг для всей семьи.
                        </Paragraph>
                        <Row justify="center" style={{marginTop: '20px'}}>
                            <Col>
                                <Link to="/doctors">
                                    <LargeButton type="primary">Наши врачи</LargeButton>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/services">
                                    <LargeButton type="primary">Наши услуги</LargeButton>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/about">
                                    <LargeButton type="primary">О нас</LargeButton>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/contacts">
                                    <LargeButton type="primary">Контакты</LargeButton>
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