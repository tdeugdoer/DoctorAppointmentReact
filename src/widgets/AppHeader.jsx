import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Layout, Menu, message, Typography} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import LoginModal from "./modal/LoginModal.jsx";
import RegisterModal from "./modal/RegisterModal.jsx";
import {LoginOutlined, LogoutOutlined, UserAddOutlined, UserOutlined, UserSwitchOutlined} from '@ant-design/icons';

const {Header} = Layout;
const {Title} = Typography;

const AppHeader = () => {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        message.success('Вы успешно вышли из системы!');
        navigate('/'); // Перенаправление на главную страницу
    };

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setIsLoginModalVisible(false);
        message.success(`Добро пожаловать, ${user.name}!`);
    };

    // Меню для администратора (только выход)
    const adminMenu = (
        <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={handleLogout}>
                Выход
            </Menu.Item>
        </Menu>
    );

    // Меню для доктора (личный кабинет и выход)
    const doctorMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserSwitchOutlined/>}>
                <Link to={`/profile/doctor/${currentUser?.id}`}>
                    Личный кабинет
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={handleLogout}>
                Выход
            </Menu.Item>
        </Menu>
    );

    // Меню для пациента (личный кабинет и выход)
    const patientMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserSwitchOutlined/>}>
                <Link to={`/profile/patient/${currentUser?.id}`}>
                    Личный кабинет
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={handleLogout}>
                Выход
            </Menu.Item>
        </Menu>
    );

    // Меню для неаутентифицированного пользователя
    const guestMenu = (
        <Menu>
            <Menu.Item key="login" icon={<LoginOutlined/>} onClick={handleLoginClick}>
                Вход
            </Menu.Item>
            <Menu.Item key="register" icon={<UserAddOutlined/>} onClick={handleRegisterClick}>
                Регистрация
            </Menu.Item>
        </Menu>
    );

    // Выбираем нужное меню в зависимости от роли
    const getUserMenu = () => {
        if (!currentUser) return guestMenu;
        if (currentUser.role === 'admin') return adminMenu;
        if (currentUser.role === 'doctor') return doctorMenu;
        if (currentUser.role === 'patient') return patientMenu;
        return guestMenu;
    };

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
                {currentUser?.role === 'admin' && (
                    <Link to="/admin/doctors">
                        <Button type="primary">Админ-панель</Button>
                    </Link>
                )}
                <Link to="/doctors">Врачи</Link>
                <Link to="/services">Услуги</Link>
                <Link to="/about">О нас</Link>
                <Link to="/contacts">Контакты</Link>
                <Dropdown overlay={getUserMenu()} trigger={['click']}>
                    <Button icon={<UserOutlined/>}/>
                </Dropdown>
            </div>

            <LoginModal
                visible={isLoginModalVisible}
                onCancel={handleLoginCancel}
                onLoginSuccess={handleLoginSuccess}
            />
            <RegisterModal visible={isRegisterModalVisible} onCancel={handleRegisterCancel}/>
        </Header>
    );
};

export default AppHeader;