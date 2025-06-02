import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Card,
    Collapse,
    DatePicker,
    Descriptions,
    Divider,
    Form,
    Input,
    List,
    message,
    Modal,
    Select,
    Spin,
    Tag,
    Typography,
    Upload
} from 'antd';
import {CameraOutlined, ClockCircleOutlined, DownloadOutlined, UploadOutlined, UserOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {fetchDoctor, updateDoctor} from "../../queries/doctors.jsx";
import {useParams} from "react-router-dom";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {createMedicalRecord, fetchAppointmentMedicalHistory} from "../../queries/medicalHistory.jsx";
import {completeAppointment, fetchAppointmentsOfDoctor} from "../../queries/appointments.jsx";
import {fetchPatient} from "../../queries/patients.jsx";

const {Item} = Descriptions;
const {Text} = Typography;
const {Panel} = Collapse;
const {TextArea} = Input;

const DoctorProfile = () => {
    const {doctorId} = useParams();
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [medicalHistory, setMedicalHistory] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [completingAppointment, setCompletingAppointment] = useState(null);
    const [medicalHistoryModalVisible, setMedicalHistoryModalVisible] = useState(false);
    const [medicalHistoryForm] = Form.useForm();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [hasMedicalHistory, setHasMedicalHistory] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const [doctorData, appointmentsData] = await Promise.all([
                    fetchDoctor(doctorId),
                    fetchAppointmentsOfDoctor(doctorId)
                ]);

                setDoctor(doctorData);

                const appointmentsWithPatients = await Promise.all(
                    appointmentsData.map(async appointment => {
                        if (!appointment.patient) {
                            return {
                                ...appointment,
                                patientData: null
                            };
                        }

                        try {
                            const patientData = await fetchPatient(appointment.patient);
                            return {
                                ...appointment,
                                patientData
                            };
                        } catch (error) {
                            console.error(`Failed to fetch patient ${appointment.patient}:`, error);
                            return {
                                ...appointment,
                                patientData: null
                            };
                        }
                    })
                );

                // Проверяем наличие медицинской истории для завершенных записей
                const historyChecks = await Promise.all(
                    appointmentsWithPatients
                        .filter(a => a.status === 'COMPLETED')
                        .map(async appointment => {
                            try {
                                const history = await fetchAppointmentMedicalHistory(appointment.id);
                                return {
                                    id: appointment.id,
                                    hasHistory: !!history.diagnosis
                                };
                            } catch {
                                return {
                                    id: appointment.id,
                                    hasHistory: false
                                };
                            }
                        })
                );

                // Обновляем состояние наличия истории
                const historyMap = historyChecks.reduce((acc, item) => {
                    acc[item.id] = item.hasHistory;
                    return acc;
                }, {});

                setHasMedicalHistory(historyMap);
                setAppointments(appointmentsWithPatients);
                form.setFieldsValue({
                    ...doctorData,
                    birthDate: dayjs(doctorData.birthDate)
                });
                setImageUrl(doctorData.image);
                setLoading(false);
            } catch (error) {
                message.error(error.message);
                setLoading(false);
            }
        };

        if (doctorId) {
            loadData();
        }
    }, [doctorId, form]);

    const handleCompleteAppointment = async (appointmentId) => {
        try {
            setCompletingAppointment(appointmentId);
            await completeAppointment(appointmentId);

            // Сохраняем текущие данные о пациентах
            const currentPatientsData = appointments.reduce((acc, appointment) => {
                if (appointment.patientData) {
                    acc[appointment.id] = appointment.patientData;
                }
                return acc;
            }, {});

            // Получаем обновленные записи
            const updatedAppointments = await fetchAppointmentsOfDoctor(doctorId);

            // Обновляем записи, сохраняя данные о пациентах
            const updatedAppointmentsWithPatients = updatedAppointments.map(appointment => {
                return {
                    ...appointment,
                    patientData: currentPatientsData[appointment.id] || null
                };
            });

            setAppointments(updatedAppointmentsWithPatients);
        } catch (error) {
            console.error("Ошибка при завершении приема:", error);
        } finally {
            setCompletingAppointment(null);
        }
    };

    const loadMedicalHistory = async (appointmentId) => {
        try {
            setHistoryLoading(true);
            setCurrentAppointmentId(appointmentId);
            const history = await fetchAppointmentMedicalHistory(appointmentId);
            setMedicalHistory(prev => ({
                ...prev,
                [appointmentId]: history
            }));

            // Обновляем состояние наличия истории
            setHasMedicalHistory(prev => ({
                ...prev,
                [appointmentId]: true
            }));

            setModalVisible(true);
        } catch (error) {
            // Если истории нет, сервер может вернуть 404
            if (error.message.includes('404')) {
                setHasMedicalHistory(prev => ({
                    ...prev,
                    [appointmentId]: false
                }));
                // Показываем форму создания
                setMedicalHistoryModalVisible(true);
            } else {
                message.error('Не удалось загрузить медицинскую историю');
            }
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCreateMedicalHistory = async () => {
        try {
            const values = await medicalHistoryForm.validateFields();

            const medicalRecordRequest = {
                appointment: currentAppointmentId,
                diagnosis: values.diagnosis,
                treatments: values.treatments?.split('\n').filter(t => t.trim()) || [],
                allergies: values.allergies?.split('\n').filter(a => a.trim()) || [],
                recommendations: values.recommendations?.split('\n').filter(r => r.trim()) || [],
                notes: values.notes || ''
            };

            await createMedicalRecord(medicalRecordRequest, selectedFiles);

            message.success('Медицинская история успешно создана!');
            setMedicalHistoryModalVisible(false);
            medicalHistoryForm.resetFields();
            setSelectedFiles([]);

            // Обновляем состояние наличия истории
            setHasMedicalHistory(prev => ({
                ...prev,
                [currentAppointmentId]: true
            }));

            // Загружаем созданную историю
            await loadMedicalHistory(currentAppointmentId);
        } catch (error) {
            message.error(`Ошибка: ${error.message}`);
        }
    };

    const handleFileChange = ({fileList}) => {
        setSelectedFiles(fileList.map(file => file.originFileObj));
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedDoctor = await updateDoctor(values, file, doctor);

            setDoctor(updatedDoctor);
            setImageUrl(updatedDoctor.image);
            setEditMode(false);
            message.success('Данные врача успешно обновлены!');
        } catch (error) {
            message.error(`Ошибка: ${error.message}`);
        }
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Можно загружать только изображения!');
        }
        return isImage;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            setFile(info.file);
            const reader = new FileReader();
            reader.readAsDataURL(info.file.originFileObj);
            reader.onload = () => setImageUrl(reader.result);
        }
    };

    const formatAppointmentDate = (dateString) => {
        return dayjs(dateString).format('DD.MM.YYYY HH:mm');
    };

    const renderStatusTag = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <Tag color="green">Завершено</Tag>;
            case 'FREE':
                return <Tag color="orange">Свободно</Tag>;
            default:
                return <Tag color="blue">Запланировано</Tag>;
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (!doctor) return <div>Врач не найден</div>;

    return (
        <LayoutComponent>
            <div style={{padding: '24px', display: 'flex', gap: '24px'}}>
                <div style={{flex: '0 0 400px'}}>
                    <Card
                        title="Профиль врача"
                        extra={
                            <Button
                                type={editMode ? 'default' : 'primary'}
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? 'Отменить' : 'Редактировать'}
                            </Button>
                        }
                    >
                        {!editMode ? (
                            <Descriptions bordered column={1}>
                                <Item label="Фото">
                                    <Avatar
                                        size={128}
                                        src={doctor.image}
                                        icon={<UserOutlined/>}
                                    />
                                </Item>
                                <Item label="Фамилия">{doctor.surname}</Item>
                                <Item label="Имя">{doctor.name}</Item>
                                <Item label="Отчество">{doctor.patronymic}</Item>
                                <Item label="Специализация">{doctor.specialization}</Item>
                                <Item label="Пол">{doctor.gender}</Item>
                                <Item label="Телефон">{doctor.phoneNumber}</Item>
                                <Item label="Стаж">{doctor.experience} лет</Item>
                                <Item label="Рейтинг">{doctor.rating}</Item>
                                <Item label="Дата рождения">
                                    {dayjs(doctor.birthDate).format('DD.MM.YYYY')}
                                </Item>
                            </Descriptions>
                        ) : (
                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item name="surname" label="Фамилия" rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="name" label="Имя" rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="patronymic" label="Отчество">
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="specialization" label="Специализация" rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="gender" label="Пол" rules={[{required: true}]}>
                                    <Select>
                                        <Select.Option value="Мужской">Мужской</Select.Option>
                                        <Select.Option value="Женский">Женский</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="phoneNumber"
                                    label="Телефон"
                                    rules={[{required: true, pattern: /^\+?[0-9]{10,15}$/}]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="experience" label="Стаж (лет)" rules={[{required: true}]}>
                                    <Input type="number"/>
                                </Form.Item>

                                <Form.Item name="birthDate" label="Дата рождения" rules={[{required: true}]}>
                                    <DatePicker style={{width: '100%'}}/>
                                </Form.Item>

                                <Form.Item label="Фото">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        customRequest={({file, onSuccess}) => {
                                            setTimeout(() => onSuccess("ok"), 0);
                                        }}
                                    >
                                        {imageUrl ? (
                                            <Avatar size={128} src={imageUrl}/>
                                        ) : (
                                            <div>
                                                <CameraOutlined style={{fontSize: '24px'}}/>
                                                <div style={{marginTop: 8}}>Загрузить фото</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Сохранить изменения
                                    </Button>
                                    <Button style={{marginLeft: '10px'}} onClick={() => setEditMode(false)}>
                                        Отмена
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Card>
                </div>

                <div style={{flex: 1, width: '700px'}}>
                    <Card title="Записи врача" style={{width: '100%'}}>
                        <List
                            itemLayout="vertical"
                            dataSource={appointments}
                            renderItem={(appointment) => (
                                <List.Item
                                    key={appointment.id}
                                    style={{
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginBottom: '16px'
                                    }}
                                >
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div style={{flex: 1}}>
                                            <Text strong style={{fontSize: '16px'}}>
                                                {appointment.service?.[0]?.name || 'Услуга не указана'}
                                            </Text>
                                            <div style={{marginTop: '8px'}}>
                                                <Text type="secondary">Пациент: </Text>
                                                <Text>
                                                    {appointment.patientData ?
                                                        `${appointment.patientData.surname} ${appointment.patientData.name}` :
                                                        'Неизвестный пациент'}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text type="secondary">Дата: </Text>
                                                <Text>{formatAppointmentDate(appointment.date)}</Text>
                                            </div>
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            {renderStatusTag(appointment.status)}
                                            <div style={{
                                                marginTop: '8px',
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center'
                                            }}>
                                                {appointment.patientData && appointment.status !== 'COMPLETED' && (
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => handleCompleteAppointment(appointment.id)}
                                                        loading={completingAppointment === appointment.id}
                                                        disabled={appointment.status === 'FREE'}
                                                    >
                                                        Завершить
                                                    </Button>
                                                )}
                                                {appointment.status === 'COMPLETED' && (
                                                    <>
                                                        {hasMedicalHistory[appointment.id] && (
                                                            <Tag color="green">Результаты созданы</Tag>
                                                        )}
                                                        <Button
                                                            type={hasMedicalHistory[appointment.id] ? "default" : "primary"}
                                                            size="small"
                                                            onClick={() => {
                                                                setCurrentAppointmentId(appointment.id);
                                                                if (hasMedicalHistory[appointment.id]) {
                                                                    loadMedicalHistory(appointment.id);
                                                                } else {
                                                                    setMedicalHistoryModalVisible(true);
                                                                }
                                                            }}
                                                        >
                                                            {hasMedicalHistory[appointment.id] ? "Просмотреть" : "Создать результат"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Divider style={{margin: '12px 0'}}/>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <ClockCircleOutlined style={{color: '#1890ff'}}/>
                                            <Text>{`${appointment.service?.[0]?.duration || '--'} мин.`}</Text>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <Text strong style={{fontSize: '16px'}}>
                                                {`${appointment.service?.[0]?.price || '--'} руб.`}
                                            </Text>
                                        </div>
                                    </div>

                                    {appointment.description && (
                                        <div style={{marginTop: '12px'}}>
                                            <Text type="secondary">Примечание: </Text>
                                            <Text>{appointment.description}</Text>
                                        </div>
                                    )}
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title="Результат"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalVisible(false)}>
                        Закрыть
                    </Button>
                ]}
                width={800}
            >
                {historyLoading ? (
                    <div style={{textAlign: 'center', padding: '24px'}}>
                        <Spin size="large"/>
                    </div>
                ) : (
                    medicalHistory[currentAppointmentId] && (
                        <Collapse accordion defaultActiveKey={['diagnosis']}>
                            {medicalHistory[currentAppointmentId].diagnosis && (
                                <Panel header="Диагноз" key="diagnosis">
                                    <Text>{medicalHistory[currentAppointmentId].diagnosis}</Text>
                                </Panel>
                            )}

                            {medicalHistory[currentAppointmentId].treatments?.length > 0 && (
                                <Panel header="Лечение" key="treatments">
                                    <ul>
                                        {medicalHistory[currentAppointmentId].treatments.map((treatment, i) => (
                                            <li key={i}>{treatment}</li>
                                        ))}
                                    </ul>
                                </Panel>
                            )}

                            {medicalHistory[currentAppointmentId].recommendations?.length > 0 && (
                                <Panel header="Рекомендации" key="recommendations">
                                    <ul>
                                        {medicalHistory[currentAppointmentId].recommendations.map((rec, i) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ul>
                                </Panel>
                            )}

                            {medicalHistory[currentAppointmentId].allergies?.length > 0 && (
                                <Panel header="Аллергии" key="allergies">
                                    <ul>
                                        {medicalHistory[currentAppointmentId].allergies.map((allergy, i) => (
                                            <li key={i}>{allergy}</li>
                                        ))}
                                    </ul>
                                </Panel>
                            )}

                            {medicalHistory[currentAppointmentId].files?.length > 0 && (
                                <Panel header="Файлы" key="files">
                                    <List
                                        size="small"
                                        dataSource={medicalHistory[currentAppointmentId].files}
                                        renderItem={file => (
                                            <List.Item>
                                                <Button type="link" icon={<DownloadOutlined/>}>
                                                    {file.name}
                                                </Button>
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            )}

                            {medicalHistory[currentAppointmentId].notes && (
                                <Panel header="Примечания" key="notes">
                                    <Text>{medicalHistory[currentAppointmentId].notes}</Text>
                                </Panel>
                            )}
                        </Collapse>
                    )
                )}
            </Modal>

            <Modal
                title="Создание медицинской истории"
                visible={medicalHistoryModalVisible}
                onCancel={() => setMedicalHistoryModalVisible(false)}
                onOk={handleCreateMedicalHistory}
                width={800}
                style={{marginTop: "-90px"}}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={medicalHistoryForm} layout="vertical">
                    <Form.Item
                        name="diagnosis"
                        label="Диагноз"
                        rules={[{required: true, message: 'Пожалуйста, укажите диагноз'}]}
                    >
                        <TextArea rows={3}/>
                    </Form.Item>

                    <Form.Item name="treatments" label="Лечение (каждое с новой строки)">
                        <TextArea rows={3} placeholder="Каждое лечение с новой строки"/>
                    </Form.Item>

                    <Form.Item name="recommendations" label="Рекомендации (каждое с новой строки)">
                        <TextArea rows={3} placeholder="Каждая рекомендация с новой строки"/>
                    </Form.Item>

                    <Form.Item name="allergies" label="Аллергии (каждое с новой строки)">
                        <TextArea rows={3} placeholder="Каждая аллергия с новой строки"/>
                    </Form.Item>

                    <Form.Item name="notes" label="Примечания">
                        <TextArea rows={3}/>
                    </Form.Item>

                    <Form.Item label="Файлы">
                        <Upload
                            multiple
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            fileList={selectedFiles.map((file, index) => ({
                                uid: index,
                                name: file.name,
                                status: 'done',
                                originFileObj: file
                            }))}
                        >
                            <Button icon={<UploadOutlined/>}>Выбрать файлы</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </LayoutComponent>
    );
};

export default DoctorProfile;