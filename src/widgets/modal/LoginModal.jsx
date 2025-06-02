import React from 'react';
import {Button, Form, Input, message, Modal} from 'antd';
import {LoginOutlined} from '@ant-design/icons';

const LoginModal = ({visible, onCancel, onLoginSuccess}) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const {username, password} = values;

        let role = null;
        let userData = {};

        if (username === 'admin' && password === 'admin') {
            role = 'admin';
            userData = {
                username,
                role,
                name: 'Администратор'
            };
        } else if (username === 'peterPetrov' && password === 'peterPetrov') {
            role = 'doctor';
            userData = {
                username,
                role,
                name: 'Пётр Петров',
                id: '586d191f-93f1-469b-8098-4e5901afd3e0'
            };
        } else if (username === 'tegor2003@gmail.com' && password === 'qw123e') {
            role = 'patient';
            userData = {
                username,
                role,
                id: '0910e49e-b1db-4378-93ba-58bae8425c75',
                name: 'Терешкевич Егор Сергеевич'
            };
        } else if (username === 'dmitriy' && password === 'dmitriy') {
            role = 'patient';
            userData = {
                username,
                role,
                id: '0910e49e-b1db-4378-93ba-58bae8425c73',
                name: 'Дмитрий Нестеров'
            };
        }

        if (role) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            form.resetFields();
            onCancel();
            if (onLoginSuccess) onLoginSuccess(userData);
        } else {
            message.error('Неверные учетные данные!');
        }
    };

    return (
        <Modal
            title={
                <span>
                    <LoginOutlined style={{marginRight: 8}}/>
                    Вход в систему
                </span>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            style={{marginTop: 150}}
        >
            <Form
                form={form}
                name="login"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{username: '', password: ''}}
            >
                <Form.Item
                    label="Имя пользователя"
                    name="username"
                    rules={[
                        {required: true, message: 'Пожалуйста, введите ваше имя пользователя!'},
                        {min: 5, message: 'Имя пользователя должно содержать не менее 5 символов.'}
                    ]}
                >
                    <Input placeholder="Введите ваше имя пользователя"/>
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                        {required: true, message: 'Пожалуйста, введите ваш пароль!'},
                        {min: 5, message: 'Пароль должен содержать не менее 5 символов.'}
                    ]}
                >
                    <Input.Password placeholder="Введите ваш пароль"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block icon={<LoginOutlined/>}>
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LoginModal;