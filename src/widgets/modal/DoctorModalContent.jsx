import React, {useEffect, useState} from 'react';
import {Collapse, DatePicker, Divider, Input, message, Rate, Spin, Table, Typography} from 'antd';
import {
    bookAppointment,
    fetchAppointmentsOfPatient,
    fetchFreeAppointmentsOfDoctor
} from "../../queries/appointments.jsx";
import {fetchFeedbacks} from "../../queries/feedbacks.jsx";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);


const {Text} = Typography;
const {Panel} = Collapse;
const {TextArea} = Input;

const {RangePicker} = DatePicker;

export const DoctorModalContent = ({selectedDoctor}) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortedInfo, setSortedInfo] = useState({});
    const [serviceFilters, setServiceFilters] = useState([]);
    const [activeFilters, setActiveFilters] = useState({});
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbacksLoading, setFeedbacksLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [commentLoading, setCommentLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) setCurrentUser(JSON.parse(user));
    }, []);

    const loadAppointments = async () => {
        if (selectedDoctor) {
            setLoading(true);
            try {
                // 1. Fetch all available appointments for the doctor
                let appointmentData = await fetchFreeAppointmentsOfDoctor(selectedDoctor.id);

                // Get current user from localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));

                // 1. For unauthenticated users - show only current month
                if (!currentUser) {
                    const currentMonthStart = dayjs().startOf('month');
                    const currentMonthEnd = dayjs().endOf('month');

                    appointmentData = appointmentData.filter(appointment => {
                        const appointmentDate = dayjs(appointment.date);
                        return appointmentDate.isBetween(currentMonthStart, currentMonthEnd, null, '[]');
                    });
                }
                // 2. For patients - check completed appointments
                else if (currentUser.role === 'patient') {
                    // First fetch all patient's appointments to check completed count
                    const patientAppointments = await fetchAppointmentsOfPatient(currentUser.id);
                    const completedCount = patientAppointments.filter(a => a.status === 'COMPLETED').length;
                    console.log(completedCount)
                    // 2.2 If less than 10 completed - show only current month
                    if (completedCount < 10) {
                        const currentMonthStart = dayjs().startOf('month');
                        const currentMonthEnd = dayjs().endOf('month');

                        appointmentData = appointmentData.filter(appointment => {
                            const appointmentDate = dayjs(appointment.date);
                            return appointmentDate.isBetween(currentMonthStart, currentMonthEnd, null, '[]');
                        });
                    }
                    // 2.1 If 10 or more completed - show all (no filtering needed)
                }
                // 3. For admin and doctor - show all (no filtering needed)

                // Process the filtered appointments
                const expandedAppointments = appointmentData.flatMap(appointment => {
                    return appointment.service.map(service => ({
                        ...appointment,
                        id: `${appointment.id}_${service.id}`,
                        serviceName: service.name,
                        servicePrice: service.price,
                        serviceDuration: service.duration,
                        originalService: service
                    }));
                });

                setAppointments(expandedAppointments);

                // Initialize service filters
                const uniqueServices = [...new Set(expandedAppointments.map(item => item.serviceName))]
                    .filter(Boolean)
                    .map(serviceName => ({
                        text: serviceName,
                        value: serviceName
                    }));

                setServiceFilters(uniqueServices);
            } catch (error) {
                console.error('Ошибка загрузки записей:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const getFilteredAppointments = () => {
        let result = [...appointments];

        // Фильтрация по услуге
        if (activeFilters.serviceName && activeFilters.serviceName.length > 0) {
            result = result.filter(item =>
                activeFilters.serviceName.includes(item.serviceName)
            );
        }

        // Фильтрация по дате
        if (dateFilter && dateFilter[0] && dateFilter[1]) {
            const start = dateFilter[0].startOf('day');
            const end = dateFilter[1].endOf('day');
            result = result.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= start && itemDate <= end;
            });
        }

        // Сортировка
        if (sortedInfo.field) {
            result.sort((a, b) => {
                if (sortedInfo.field === 'date') {
                    return sortedInfo.order === 'ascend'
                        ? new Date(a.date) - new Date(b.date)
                        : new Date(b.date) - new Date(a.date);
                }
                if (sortedInfo.field === 'servicePrice') {
                    return sortedInfo.order === 'ascend'
                        ? (a.servicePrice || 0) - (b.servicePrice || 0)
                        : (b.servicePrice || 0) - (a.servicePrice || 0);
                }
                if (sortedInfo.field === 'serviceDuration') {
                    return sortedInfo.order === 'ascend'
                        ? (a.serviceDuration || 0) - (b.serviceDuration || 0)
                        : (b.serviceDuration || 0) - (a.serviceDuration || 0);
                }
                return 0;
            });
        }

        return result;
    };

    useEffect(() => {
        loadAppointments();
    }, [selectedDoctor, currentUser]); // Добавляем currentUser в зависимости

    useEffect(() => {
        const loadFeedbacks = async () => {
            if (selectedDoctor) {
                setFeedbacksLoading(true);
                try {
                    const feedbackData = await fetchFeedbacks(selectedDoctor.id);
                    setFeedbacks(feedbackData);
                } catch (error) {
                    console.error('Ошибка загрузки отзывов:', error);
                } finally {
                    setFeedbacksLoading(false);
                }
            }
        };

        loadFeedbacks();
    }, [selectedDoctor]);

    const handleDateFilter = (dates) => {
        setDateFilter(dates);
    };

    const handleBookAppointment = async (appointmentId, serviceId) => {
        try {
            setLoading(true);
            await bookAppointment(appointmentId, serviceId);
            await loadAppointments();
        } catch (error) {
            message.error('Не удалось записаться на прием');
            console.error('Ошибка при записи:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) {
            message.warning('Пожалуйста, введите комментарий');
            return;
        }

        if (rating === 0) {
            message.warning('Пожалуйста, поставьте оценку');
            return;
        }

        try {
            setCommentLoading(true);
            const newFeedback = await createFeedback({
                doctorId: selectedDoctor.id,
                rating,
                comment: newComment
            });

            setFeedbacks([...feedbacks, newFeedback]);
            setNewComment('');
            setRating(0);
            message.success('Отзыв успешно добавлен!');
        } catch (error) {
            message.error('Не удалось добавить отзыв');
            console.error('Ошибка при создании отзыва:', error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setActiveFilters(filters);
    };

    const columns = [
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => (
                <div style={{padding: 8}}>
                    <RangePicker
                        onChange={(dates) => {
                            setSelectedKeys(dates || []);
                            setDateFilter(dates);
                            confirm();
                        }}
                        style={{width: '100%'}}
                    />
                </div>
            ),
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Услуга',
            dataIndex: 'serviceName',
            key: 'serviceName',
            filters: serviceFilters,
            filterMultiple: true,
            filteredValue: activeFilters.serviceName || null,
            onFilter: (value, record) => record.serviceName === value,
            render: (text) => text || 'Не указано',
        },
        {
            title: 'Цена',
            dataIndex: 'servicePrice',
            key: 'servicePrice',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'servicePrice' && sortedInfo.order,
            render: (price) => price ? `${price} р.` : '0 р.',
        },
        {
            title: 'Длительность',
            dataIndex: 'serviceDuration',
            key: 'serviceDuration',
            sorter: true,
            sortOrder: sortedInfo.columnKey === 'serviceDuration' && sortedInfo.order,
            render: (duration) => `${duration} мин`,
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => {
                if (record.status !== 'FREE') {
                    return <Text type="secondary">Недоступно</Text>;
                }

                const [appointmentId, __] = record.id.split('_');
                const serviceId = record.originalService.id;

                return (
                    <Text
                        type="success"
                        style={{cursor: 'pointer'}}
                        onClick={() => handleBookAppointment(appointmentId, serviceId)}
                    >
                        Записаться на прием
                    </Text>
                );
            },
        },
    ];

    const filteredAppointments = getFilteredAppointments();
    const isPatient = currentUser?.role === 'patient';

    return selectedDoctor ? (
        <div className="modal-content" style={{display: 'flex', flexDirection: 'column'}}>
            {/* Информация о враче */}
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div className="image-container">
                    {selectedDoctor.image && (
                        <img
                            src={selectedDoctor.image}
                            alt={selectedDoctor.name}
                            style={{maxWidth: '100%', maxHeight: '235px'}}
                        />
                    )}
                </div>
                <div className="text-container" style={{marginLeft: '20px', marginTop: '-20px', flexGrow: 1}}>
                    {Object.entries(selectedDoctor).map(([key, value]) => {
                        if (value !== null && key !== 'id' && key !== 'image' && key !== 'birthDate') {
                            const keyTranslations = {
                                'Name': 'Имя',
                                'Surname': 'Фамилия',
                                'Specialization': 'Специализация',
                                'Gender': 'Пол',
                                'Phone Number': 'Номер телефона',
                                'Birth Date': 'День рождения',
                                'Rating': 'Рейтинг',
                                'Experience': 'Опыт'
                            };

                            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                            const translatedKey = keyTranslations[formattedKey] || formattedKey;

                            return (
                                <div key={key}>
                                    <p>
                                        <strong>{translatedKey}:</strong> {value}
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>

            {/* Доступные записи */}
            <div style={{marginTop: '10px'}}>
                {loading ? (
                    <Spin/>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredAppointments}
                        rowKey="id"
                        onChange={handleTableChange}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: false,
                            style: {marginBottom: '-15px'}
                        }}
                        locale={{
                            emptyText: filteredAppointments.length === 0 && appointments.length > 0
                                ? 'Нет записей по выбранным фильтрам'
                                : 'Нет доступных записей'
                        }}
                    />
                )}
            </div>

            {/* Список отзывов */}
            <Divider orientation="left">Отзывы пациентов</Divider>
            {feedbacksLoading ? (
                <Spin tip="Загрузка отзывов..."/>
            ) : feedbacks.length > 0 ? (
                <Collapse accordion>
                    {feedbacks.map(feedback => (
                        <Panel
                            header={`Отзыв от ${new Date(feedback.creationTime).toLocaleDateString()}`}
                            key={feedback.id}
                            extra={<Rate disabled value={feedback.rating}/>}
                        >
                            <div style={{padding: '10px'}}>
                                {feedback.comment ? (
                                    <Text>{feedback.comment}</Text>
                                ) : (
                                    <Text type="secondary">Пациент не оставил комментарий</Text>
                                )}
                            </div>
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                <Text type="secondary">Пока нет отзывов</Text>
            )}
        </div>
    ) : (
        <p>Выберите врача, чтобы увидеть детали.</p>
    );
};