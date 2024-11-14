import React from 'react';
import {Layout, Typography} from 'antd';
import {Link} from 'react-router-dom';

const {Header} = Layout;
const {Title} = Typography;

const AppHeader = () => {
    return (
        <Header style={{
            backgroundColor: '#ffffff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Title level={4} style={{margin: 0, color: "blue"}}>Zdorowo</Title>
            <div style={{display: 'flex', gap: '16px'}}> {}
                <Link to="/doctors">Врачи</Link>
                <Link to="/services">Услуги</Link>
                <Link to="/about">О нас</Link>
                <Link to="/contact">Контакты</Link>
            </div>
        </Header>
    );
};

export default AppHeader;