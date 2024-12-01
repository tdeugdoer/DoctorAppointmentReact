import React from 'react';
import AppHeader from './AppHeader';
import {Layout} from 'antd';
import AppFooter from "./AppFooter.jsx";

const {Content} = Layout;

const LayoutComponent = ({children}) => {
    return (
        <Layout style={{minHeight: '100vh'}}>
            <AppHeader/>
            <Content style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0'}}>
                {children}
            </Content>
            <AppFooter/>
        </Layout>
    );
};

export default LayoutComponent;