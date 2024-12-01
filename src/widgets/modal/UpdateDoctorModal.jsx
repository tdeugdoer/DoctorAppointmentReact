import React, {useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, Modal, Select, Upload} from "antd";
import dayjs from "dayjs";
import {updateDoctor} from "../../queries/doctors.jsx";

const {Option} = Select;

const UpdateDoctorModal = ({visible, onClose, doctor}) => {
    const [form] = Form.useForm();
    const [file, setFile] = React.useState(null);

    useEffect(() => {
        if (visible && doctor) {
            form.setFieldsValue({
                name: doctor.name,
                surname: doctor.surname,
                patronymic: doctor.patronymic,
                specialization: doctor.specialization,
                gender: doctor.gender,
                phoneNumber: doctor.phoneNumber,
                experience: doctor.experience,
                birthDate: dayjs(doctor.birthDate),
            });
            setFile(null);
        }
    }, [visible, doctor, form]);

    const handleSubmit = async (values) => {
        try {
            await updateDoctor(values, file, doctor);
            form.resetFields();
            setFile(null);
            onClose();
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const handleUploadChange = ({fileList}) => {
        setFile(fileList[0]);
    };

    return (
        <Modal
            title="Update Doctor"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            style={{marginTop: -60}}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{marginBottom: 0}}
            >
                <Form.Item
                    name="name"
                    label="First Name"
                    rules={[
                        {required: true, message: "Name is required"},
                        {max: 15, message: "Name cannot exceed 15 characters"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Enter first name"/>
                </Form.Item>

                <Form.Item
                    name="surname"
                    label="Last Name"
                    rules={[
                        {required: true, message: "Last name is required"},
                        {max: 15, message: "Last name cannot exceed 15 characters"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Enter last name"/>
                </Form.Item>

                <Form.Item
                    name="patronymic"
                    label="Patronymic"
                    rules={[{max: 15, message: "Patronymic cannot exceed 15 characters"}]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Enter patronymic"/>
                </Form.Item>

                <Form.Item
                    name="specialization"
                    label="Specialization"
                    rules={[{required: true, message: "Specialization is required"}]}
                    style={{marginBottom: 8}}
                >
                    <Select>
                        <Option value="Therapy">Therapy</Option>
                        <Option value="Surgery">Surgery</Option>
                        <Option value="Pediatrics">Pediatrics</Option>
                        <Option value="Neurology">Neurology</Option>
                        <Option value="Dentistry">Dentistry</Option>
                        <Option value="Gynecology">Gynecology</Option>
                        <Option value="Dermatological">Dermatological</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{required: true, message: "Gender is required"}]}
                    style={{marginBottom: 8}}
                >
                    <Select>
                        <Option value="Men">Male</Option>
                        <Option value="Women">Female</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        {required: true, message: "Phone number is required"},
                        {pattern: /^[+]?[0-9]{10,15}$/, message: "Invalid phone number format"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Enter phone number"/>
                </Form.Item>

                <Form.Item
                    name="experience"
                    label="Experience (years)"
                    rules={[
                        {required: true, message: "Experience is required"},
                        {type: "number", min: 0, max: 100, message: "Experience must be between 0 and 100"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <InputNumber min={0} max={100} style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    name="birthDate"
                    label="Birth Date"
                    rules={[
                        {required: true, message: "Birth date is required"},
                        {
                            validator: (_, value) =>
                                value && dayjs(value).isBefore(dayjs())
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Birth date must be in the past")),
                        },
                    ]}
                    style={{marginBottom: 8}}
                >
                    <DatePicker format="YYYY-MM-DD" style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    name="file"
                    label="Profile Picture"
                    style={{marginBottom: 8}}
                >
                    <Upload
                        maxCount={1}
                        accept="image/*"
                        beforeUpload={() => false}
                        onChange={handleUploadChange}
                    >
                        <Button>Upload Picture</Button>
                    </Upload>
                </Form.Item>

                <Form.Item style={{marginTop: 16, marginBottom: 0}}>
                    <Button type="primary" htmlType="submit">
                        Update Doctor
                    </Button>
                    <Button style={{marginLeft: 8}} onClick={onClose}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateDoctorModal;