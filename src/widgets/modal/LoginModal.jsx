import React from 'react';
import {Button, Form, Input, message, Modal} from 'antd';

const LoginModal = ({visible, onCancel}) => {
    const onFinish = (values) => {
        console.log('Login values:', values);
        message.success('Login successful!');
        onCancel();
    };

    return (
        <Modal
            title="Login"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            style={{marginTop: 150}}
        >
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{username: '', password: ''}}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {required: true, message: 'Please input your username!'},
                        {min: 5, message: 'Username must be at least 5 characters.'}
                    ]}
                >
                    <Input placeholder="Enter your username"/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {required: true, message: 'Please input your password!'},
                        {min: 5, message: 'Password must be at least 5 characters.'}
                    ]}
                >
                    <Input.Password placeholder="Enter your password"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LoginModal;