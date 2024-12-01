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
                <Link to="/admin/doctors">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Doctors
                    </Button>
                </Link>
                <Link to="/admin/patients">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Patients
                    </Button>
                </Link>
                <Link to="/admin/services">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Services
                    </Button>
                </Link>
                <Link to="/admin/appointments">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        Appointments
                    </Button>
                </Link>
            </div>
            <div>
                <Link to="/">
                    <Button type="primary" size="large" style={{width: '150px'}}>
                        User Menu
                    </Button>
                </Link>
            </div>
        </Header>
    );
};

export default AdminAppHeader;