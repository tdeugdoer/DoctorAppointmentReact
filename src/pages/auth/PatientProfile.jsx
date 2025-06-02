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
    Popconfirm,
    Rate,
    Select,
    Space,
    Spin,
    Tag,
    Typography,
    Upload
} from 'antd';
import {
    CameraOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    FileTextOutlined,
    StarFilled,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {fetchPatient, updatePatient} from "../../queries/patients.jsx";
import {fetchAppointmentsOfPatient, freeAppointment} from "../../queries/appointments.jsx";
import {useParams} from "react-router-dom";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {fetchAppointmentMedicalHistory} from "../../queries/medicalHistory.jsx";
import {createFeedback, fetchFeedbacksAll} from "../../queries/feedbacks.jsx";

const {Item} = Descriptions;
const {Text} = Typography;
const {Panel} = Collapse;
const {TextArea} = Input;

const PatientProfile = () => {
    const {patientId} = useParams();
    const [patient, setPatient] = useState(null);
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
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [currentFeedbackAppointmentId, setCurrentFeedbackAppointmentId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]); // Добавлено состояние для хранения всех отзывов

    useEffect(() => {
        const loadData = async () => {
            try {
                const [patientData, appointmentsData, feedbacksData] = await Promise.all([
                    fetchPatient(patientId),
                    fetchAppointmentsOfPatient(patientId),
                    fetchFeedbacksAll()
                ]);

                setPatient(patientData);
                setAppointments(appointmentsData);
                setFeedbacks(feedbacksData.objectList); // Access objectList here
                form.setFieldsValue({
                    ...patientData,
                    birthDate: dayjs(patientData.birthDate)
                });
                setImageUrl(patientData.image);

                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                message.error('Произошла ошибка при загрузке данных');
                setLoading(false);
            }
        };

        if (patientId) {
            loadData();
        }
    }, [patientId, form]);

    // Функция для получения отзыва по ID записи
    const getFeedbackForAppointment = (appointmentId) => {
        if (Array.isArray(feedbacks)) {
            console.log(feedbacks.find(feedback => feedback.appointment === appointmentId))
            return feedbacks.find(feedback => feedback.appointment === appointmentId);
        }
        return null; // or handle as needed
    };

    const handleFreeAppointment = async (appointmentId) => {
        try {
            await freeAppointment(appointmentId);
            // Обновляем данные после успешной отмены
            const updatedAppointments = await fetchAppointmentsOfPatient(patientId);
            setAppointments(updatedAppointments);
        } catch (error) {
            console.error('Ошибка при отмене записи:', error);
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            setSubmittingFeedback(true);

            const feedbackRequest = {
                appointment: currentFeedbackAppointmentId,
                rating: rating,
                comment: comment
            };

            const newFeedback = await createFeedback(feedbackRequest);

            // Обновляем список отзывов
            setFeedbacks(prev => [...prev, newFeedback]);

            message.success('Отзыв успешно отправлен!');
            setFeedbackModalVisible(false);
            setRating(0);
            setComment('');
        } catch (error) {
            message.error(`Ошибка: ${error.message}`);
        } finally {
            setSubmittingFeedback(false);
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
            setModalVisible(true);
        } catch (error) {
            message.error('Результат отсутствует');
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedPatient = await updatePatient(values, file, patient);

            setPatient(updatedPatient);
            setImageUrl(updatedPatient.image);
            setEditMode(false);
            message.success('Данные пациента успешно обновлены!');
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

    if (loading) return <div>Загрузка...</div>;
    if (!patient) return <div>Пациент не найден</div>;

    return (
        <LayoutComponent>
            <div style={{padding: '24px', display: 'flex', gap: '24px'}}>
                <div style={{flex: '0 0 400px'}}>
                    <Card
                        title="Профиль пациента"
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
                                        src={patient.image}
                                        icon={<UserOutlined/>}
                                    />
                                </Item>
                                <Item label="Фамилия">{patient.surname}</Item>
                                <Item label="Имя">{patient.name}</Item>
                                <Item label="Отчество">{patient.patronymic}</Item>
                                <Item label="Пол">{patient.gender}</Item>
                                <Item label="Телефон">{patient.phoneNumber}</Item>
                                <Item label="Дата рождения">
                                    {dayjs(patient.birthDate).format('DD.MM.YYYY')}
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
                    <Card title="Записи пациента" style={{width: '100%'}}>
                        <List
                            itemLayout="vertical"
                            dataSource={appointments}
                            renderItem={(appointment) => {
                                const feedback = getFeedbackForAppointment(appointment.id);

                                return (
                                    <List.Item
                                        key={appointment.id}
                                        style={{
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px'
                                        }}>
                                            <div>
                                                <Text strong
                                                      style={{fontSize: '16px'}}>{appointment.service[0].name}</Text>
                                                <div style={{marginTop: '8px'}}>
                                                    <Text type="secondary">Доктор: </Text>
                                                    <Text>{`${appointment.doctor.surname} ${appointment.doctor.name}`}</Text>
                                                </div>
                                            </div>
                                            <div>
                                                <Tag color={appointment.status === 'COMPLETED' ? 'green' :
                                                    appointment.status === 'BOOKED' ? 'blue' : 'default'}>
                                                    {appointment.status === 'COMPLETED' ? 'Завершено' :
                                                        appointment.status === 'BOOKED' ? 'Запланировано' : appointment.status}
                                                </Tag>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px'
                                        }}>
                                            <div>
                                                <Text type="secondary">Дата: </Text>
                                                <Text>{formatAppointmentDate(appointment.date)}</Text>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <ClockCircleOutlined style={{color: '#1890ff'}}/>
                                                <Text>{`${appointment.service[0].duration} мин.`}</Text>
                                            </div>
                                            <div>
                                                <Text strong style={{fontSize: '16px'}}>
                                                    {`${appointment.service[0].price} руб.`}
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Блок с отзывом, если он существует */}
                                        {feedback && (
                                            <div style={{
                                                background: '#fafafa',
                                                padding: '12px',
                                                borderRadius: '4px',
                                                marginBottom: '12px',
                                                borderLeft: '4px solid #1890ff'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: feedback.comment ? '8px' : '0'
                                                }}>
                                                    <Text strong style={{marginRight: '8px'}}>Ваш отзыв:</Text>
                                                    <Rate
                                                        value={feedback.rating}
                                                        disabled
                                                        character={<StarFilled style={{color: '#faad14'}}/>}
                                                        style={{fontSize: '16px'}}
                                                    />
                                                    <Text type="secondary"
                                                          style={{marginLeft: '8px', fontSize: '12px'}}>
                                                        {dayjs(feedback.creationTime).format('DD.MM.YYYY HH:mm')}
                                                    </Text>
                                                </div>
                                                {feedback.comment && (
                                                    <Text style={{whiteSpace: 'pre-wrap'}}>{feedback.comment}</Text>
                                                )}
                                            </div>
                                        )}

                                        <Divider style={{margin: '8px 0'}}/>

                                        <Space style={{display: 'flex', justifyContent: 'space-between'}}>
                                            {appointment.description && (
                                                <div>
                                                    <Text type="secondary">Примечание: </Text>
                                                    <Text>{appointment.description}</Text>
                                                </div>
                                            )}
                                            <Space>
                                                {/* Кнопка "Результаты" для завершенных записей */}
                                                {appointment.status === 'COMPLETED' && (
                                                    <Button
                                                        type="link"
                                                        icon={<FileTextOutlined/>}
                                                        onClick={() => loadMedicalHistory(appointment.id)}
                                                        loading={historyLoading && currentAppointmentId === appointment.id}
                                                    >
                                                        Результаты
                                                    </Button>
                                                )}
                                                {/* Кнопка "Оставить отзыв" для завершенных записей без отзыва */}
                                                {appointment.status === 'COMPLETED' && !feedback && (
                                                    <Button
                                                        type="link"
                                                        onClick={() => {
                                                            setCurrentFeedbackAppointmentId(appointment.id);
                                                            setFeedbackModalVisible(true);
                                                        }}
                                                    >
                                                        Оставить отзыв
                                                    </Button>
                                                )}
                                                {/* Кнопка "Отменить" для запланированных записей */}
                                                {appointment.status === 'BOOKED' && (
                                                    <Popconfirm
                                                        title="Вы уверены, что хотите отменить запись?"
                                                        onConfirm={() => handleFreeAppointment(appointment.id)}
                                                        okText="Да"
                                                        cancelText="Нет"
                                                    >
                                                        <Button type="link" danger>
                                                            Отменить запись
                                                        </Button>
                                                    </Popconfirm>
                                                )}
                                            </Space>
                                        </Space>
                                    </List.Item>
                                );
                            }}
                        />
                    </Card>
                </div>
            </div>

            {/* Модальное окно с медицинской историей */}
            <Modal
                title="Результат"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
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
                                                <Button
                                                    type="link"
                                                    icon={<DownloadOutlined/>}
                                                    href={file.link}
                                                    target="_blank"
                                                >
                                                    {file.fileKey.split('/').pop()}
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

            {/* Модальное окно для создания отзыва */}
            <Modal
                title="Оставить отзыв"
                visible={feedbackModalVisible}
                onCancel={() => setFeedbackModalVisible(false)}
                onOk={handleSubmitFeedback}
                okText="Отправить"
                cancelText="Отмена"
                confirmLoading={submittingFeedback}
            >
                <div style={{marginBottom: 16}}>
                    <Text strong>Оценка:</Text>
                    <Rate
                        value={rating}
                        onChange={setRating}
                        style={{marginLeft: 10}}
                    />
                </div>
                <TextArea
                    rows={4}
                    placeholder="Ваш комментарий (необязательно)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </Modal>
        </LayoutComponent>
    );
};

export default PatientProfile;