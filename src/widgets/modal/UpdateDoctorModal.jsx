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
            console.error("Ошибка при отправке:", error);
        }
    };

    const handleUploadChange = ({fileList}) => {
        setFile(fileList[0]);
    };

    return (
        <Modal
            title="Обновить врача"
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
                    label="Имя"
                    rules={[
                        {required: true, message: "Имя обязательно"},
                        {max: 15, message: "Имя не должно превышать 15 символов"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите имя"/>
                </Form.Item>

                <Form.Item
                    name="surname"
                    label="Фамилия"
                    rules={[
                        {required: true, message: "Фамилия обязательна"},
                        {max: 15, message: "Фамилия не должна превышать 15 символов"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите фамилию"/>
                </Form.Item>

                <Form.Item
                    name="patronymic"
                    label="Отчество"
                    rules={[{max: 15, message: "Отчество не должно превышать 15 символов"}]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите отчество"/>
                </Form.Item>

                <Form.Item
                    name="specialization"
                    label="Специализация"
                    rules={[{required: true, message: "Специализация обязательна"}]}
                    style={{marginBottom: 8}}
                >
                    <Select>
                        <Option value="Therapy">Терапевт</Option>
                        <Option value="Surgery">Хирургия</Option>
                        <Option value="Pediatrics">Педиатрия</Option>
                        <Option value="Neurology">Неврология</Option>
                        <Option value="Dentistry">Стоматология</Option>
                        <Option value="Gynecology">Гинекология</Option>
                        <Option value="Dermatological">Дерматология</Option>
                        <Option value="Other">Другое</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Пол"
                    rules={[{required: true, message: "Пол обязателен"}]}
                    style={{marginBottom: 8}}
                >
                    <Select>
                        <Option value="Men">Мужской</Option>
                        <Option value="Women">Женский</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Номер телефона"
                    rules={[
                        {required: true, message: "Номер телефона обязателен"},
                        {pattern: /^[+]?[0-9]{10,15}$/, message: "Неверный формат номера телефона"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <Input placeholder="Введите номер телефона"/>
                </Form.Item>

                <Form.Item
                    name="experience"
                    label="Опыт (лет)"
                    rules={[
                        {required: true, message: "Опыт обязателен"},
                        {type: "number", min: 0, max: 100, message: "Опыт должен быть от 0 до 100"},
                    ]}
                    style={{marginBottom: 8}}
                >
                    <InputNumber min={0} max={100} style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    name="birthDate"
                    label="Дата рождения"
                    rules={[
                        {required: true, message: "Дата рождения обязательна"},
                        {
                            validator: (_, value) =>
                                value && dayjs(value).isBefore(dayjs())
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Дата рождения должна быть в прошлом")),
                        },
                    ]}
                    style={{marginBottom: 8}}
                >
                    <DatePicker format="YYYY-MM-DD" style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item
                    name="file"
                    label="Фото профиля"
                    style={{marginBottom: 8}}
                >
                    <Upload
                        maxCount={1}
                        accept="image/*"
                        beforeUpload={() => false}
                        onChange={handleUploadChange}
                    >
                        <Button>Загрузить фото</Button>
                    </Upload>
                </Form.Item>

                <Form.Item style={{marginTop: 16, marginBottom: 0}}>
                    <Button type="primary" htmlType="submit">
                        Обновить врача
                    </Button>
                    <Button style={{marginLeft: 8}} onClick={onClose}>
                        Отмена
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateDoctorModal;