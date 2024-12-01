import React from 'react';
import {Button, Layout, Typography} from 'antd';
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
            alignItems: 'center',
            fontSize: "1.1em"
        }}>
            <Title level={4} style={{margin: 0, color: "blue"}}>
                <Link to="/">Zdorowo</Link>
            </Title>
            <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                <Link to="/doctors">Doctors</Link>
                <Link to="/services">Services</Link>
                <Link to="/about">About us</Link>
                <Link to="/contacts">Contacts</Link>
                <Link to="/admin/doctors">
                    <Button type="primary">Admin Menu</Button>
                </Link>
            </div>
        </Header>
    );
};

export default AppHeader;