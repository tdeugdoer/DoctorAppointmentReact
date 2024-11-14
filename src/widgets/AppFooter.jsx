import React from 'react';
import {Layout, Typography} from 'antd';

const {Footer} = Layout;
const {Text} = Typography; // Используем Text для простого текста

const AppFooter = () => {
    return (
        <Footer style={{backgroundColor: '#ffffff', padding: '16px 24px', textAlign: 'center', color: '#333'}}>
            <Text>© 2024 Zdorowo</Text> {}
        </Footer>
    );
};

export default AppFooter;