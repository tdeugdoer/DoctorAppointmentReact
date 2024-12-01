import React, {useState} from 'react';
import {Button, Dropdown, Layout, Menu, Typography} from 'antd';
import {Link} from 'react-router-dom';
import LoginModal from "./modal/LoginModal.jsx";
import RegisterModal from "./modal/RegisterModal.jsx"; // Import RegisterModal
import {UserOutlined} from '@ant-design/icons';

const {Header} = Layout;
const {Title} = Typography;

const AppHeader = () => {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

    const handleLoginClick = () => {
        setIsLoginModalVisible(true);
    };

    const handleRegisterClick = () => {
        setIsRegisterModalVisible(true);
    };

    const handleLoginCancel = () => {
        setIsLoginModalVisible(false);
    };

    const handleRegisterCancel = () => {
        setIsRegisterModalVisible(false);
    };

    const menu = (
        <Menu>
            <Menu.Item key="login" onClick={handleLoginClick}>
                Login
            </Menu.Item>
            <Menu.Item key="register" onClick={handleRegisterClick}>
                Register
            </Menu.Item>
        </Menu>
    );

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
                <Link to="/admin/doctors">
                    <Button type="primary">Admin Menu</Button>
                </Link>
                <Link to="/doctors">Doctors</Link>
                <Link to="/services">Services</Link>
                <Link to="/about">About us</Link>
                <Link to="/contacts">Contacts</Link>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<UserOutlined/>}/>
                </Dropdown>
            </div>

            <LoginModal visible={isLoginModalVisible} onCancel={handleLoginCancel}/>
            <RegisterModal visible={isRegisterModalVisible} onCancel={handleRegisterCancel}/>
        </Header>
    );
};

export default AppHeader;