import React from 'react';
import {Navigate} from 'react-router-dom';
import {message} from 'antd';

const ProtectedRoute = ({children, requiredRole}) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user || user.role !== requiredRole) {
        message.warning('Доступ запрещен! Недостаточно прав.');
        return <Navigate to="/" replace/>;
    }

    return children;
};

export default ProtectedRoute;