import React from 'react';
import {Button, DatePicker, Form, Input, message, Modal, Select, Upload} from 'antd';
import moment from 'moment';
import {UploadOutlined} from '@ant-design/icons';

const RegisterModal = ({visible, onCancel}) => {
    const onFinish = (values) => {
        // Фиксированные данные для аутентификации
        const authData = {
            username: 'tegor2003@gmail.com',
            role: 'patient',
            id: '0910e49e-b1db-4378-93ba-58bae8425c75',
            name: 'Терешкевич Егор Сергеевич'
        };

        localStorage.setItem('currentUser', JSON.stringify(authData));
        message.success('Вы успешно зарегистрировались!');

        onCancel();

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <Modal
            title="Регистрация"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            style={{marginTop: -60}}
        >
            <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{name: '', surname: '', patronymic: '', gender: '', phoneNumber: '', birthDate: null}}
                style={{marginBottom: -30}}
            >
                <Form.Item
                    label="Имя пользователя"
                    name="username"
                    rules={[
                        {required: true, message: 'Пожалуйста, введите ваше имя пользователя!'},
                        {min: 5, message: 'Имя пользователя должно содержать не менее 5 символов.'}
                    ]}
                    style={{marginBottom: 8}}
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
                    style={{marginBottom: 8}}
                >
                    <Input.Password placeholder="Введите ваш пароль"/>
                </Form.Item>

                <Form.Item
                    label="Имя"
                    name="name"
                    rules={[
                        {required: true, message: 'Пожалуйста, введите ваше имя!'},
                        {max: 15, message: 'Имя не должно превышать 15 символов.'}
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите ваше имя"/>
                </Form.Item>

                <Form.Item
                    label="Фамилия"
                    name="surname"
                    rules={[
                        {required: true, message: 'Пожалуйста, введите вашу фамилию!'},
                        {max: 15, message: 'Фамилия не должна превышать 15 символов.'}
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите вашу фамилию"/>
                </Form.Item>

                <Form.Item
                    label="Отчество"
                    name="patronymic"
                    rules={[{max: 15, message: 'Отчество не должно превышать 15 символов.'}]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите ваше отчество"/>
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Пол"
                    rules={[{required: true, message: "Пол обязателен"}]}
                    style={{marginBottom: 8}}
                >
                    <Select>
                        <Select.Option value="Men">Мужской</Select.Option>
                        <Select.Option value="Women">Женский</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Номер телефона"
                    name="phoneNumber"
                    rules={[{required: true, message: 'Пожалуйста, введите ваш номер телефона!'}]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите ваш номер телефона"/>
                </Form.Item>

                <Form.Item
                    label="Дата рождения"
                    name="birthDate"
                    rules={[{required: true, message: 'Пожалуйста, выберите вашу дату рождения!'}]}
                    style={{marginBottom: 8}}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        style={{width: '100%'}}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                </Form.Item>

                <Form.Item
                    label="Фото профиля"
                    name="profilePicture"
                    rules={[{required: true, message: 'Пожалуйста, загрузите ваше фото профиля!'}]}
                    style={{marginBottom: 8}}
                >
                    <Upload
                        name="profilePicture"
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined/>}>Загрузить фото профиля</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Зарегистрироваться
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RegisterModal;