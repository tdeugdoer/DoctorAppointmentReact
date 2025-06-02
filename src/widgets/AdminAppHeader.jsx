import React from 'react';
import {Button, Layout} from 'antd';
import {Link} from 'react-router-dom';

const {Header} = Layout;

const AdminAppHeader = () => {
    return (
        <Header style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 24px',
            backgroundColor: '#ffffff',
        }}>
            <div style={{display: 'flex', gap: '16px'}}>
                <Link to="/admin/patients">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Пациенты
                    </Button>
                </Link>
                <Link to="/admin/services">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Услуги
                    </Button>
                </Link>
                <Link to="/admin/feedbacks">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Отзывы
                    </Button>
                </Link>
                <Link to="/admin/doctors">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Врачи
                    </Button>
                </Link>
                <Link to="/admin/work-days">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Рабочие дни
                    </Button>
                </Link>
                <Link to="/admin/appointments">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Записи
                    </Button>
                </Link>
            </div>
            <div>
                <Link to="/">
                    <Button type="primary" size="large" style={{width: '200px'}}>
                        Пользовательское меню
                    </Button>
                </Link>
            </div>
        </Header>
    );
};

export default AdminAppHeader;