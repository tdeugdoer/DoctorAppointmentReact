import React from 'react';
import {Button, DatePicker, Form, Input, message, Modal, Select, Upload} from 'antd';
import moment from 'moment';
import {UploadOutlined} from '@ant-design/icons';

const RegisterModal = ({visible, onCancel}) => {
    const onFinish = (values) => {
        console.log('Registration values:', values);
        message.success('Registration successful!');
        onCancel();
    };

    return (
        <Modal
            title="Register"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            style={{marginTop: -80}}
        >
            <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{name: '', surname: '', patronymic: '', gender: '', phoneNumber: '', birthDate: null}}
                style={{marginBottom: -30}}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}, {
                        min: 5,
                        message: 'Username must be at least 5 characters.'
                    }]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Input placeholder="Enter your username"/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}, {
                        min: 5,
                        message: 'Password must be at least 5 characters.'
                    }]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Input.Password placeholder="Enter your password"/>
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: 'Please input your name!'}, {
                        max: 15,
                        message: 'Name cannot exceed 15 characters.'
                    }]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Input placeholder="Enter your name"/>
                </Form.Item>

                <Form.Item
                    label="Surname"
                    name="surname"
                    rules={[{required: true, message: 'Please input your surname!'}, {
                        max: 15,
                        message: 'Surname cannot exceed 15 characters.'
                    }]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Input placeholder="Enter your surname"/>
                </Form.Item>

                <Form.Item
                    label="Patronymic"
                    name="patronymic"
                    rules={[{max: 15, message: 'Patronymic cannot exceed 15 characters.'}]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Input placeholder="Enter your patronymic"/>
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{required: true, message: "Gender is required"}]}
                    style={{marginBottom: 8}} // Уменьшение отступа
                >
                    <Select>
                        <Option value="Men">Male</Option>
                        <Option value="Women">Female</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[{required: true, message: 'Please input your phone number!'}]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Input placeholder="Enter your phone number"/>
                </Form.Item>

                <Form.Item
                    label="Birth Date"
                    name="birthDate"
                    rules={[{required: true, message: 'Please select your birth date!'}]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        style={{width: '100%'}}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                </Form.Item>

                <Form.Item
                    label="Profile Picture"
                    name="profilePicture"
                    rules={[{required: true, message: 'Please upload your profile picture!'}]}
                    style={{marginBottom: 8}} // Reduced margin
                >
                    <Upload
                        name="profilePicture"
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        <Button icon={<UploadOutlined/>}>Upload Profile Picture</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RegisterModal;