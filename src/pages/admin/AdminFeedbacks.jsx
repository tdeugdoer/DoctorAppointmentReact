import React, {useEffect, useState} from "react";
import {DatePicker, Input, message, Rate, Table, Typography} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {fetchFeedbacksAll} from "../../queries/feedbacks.jsx";
import {fetchPatient} from "../../queries/patients.jsx";
import {fetchDoctor} from "../../queries/doctors.jsx";
import {fetchService} from "../../queries/services.jsx";

const {Search} = Input;
const {Text} = Typography;
const {RangePicker} = DatePicker;

const AdminFeedbacks = () => {
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [patients, setPatients] = useState({});
    const [doctors, setDoctors] = useState({});
    const [services, setServices] = useState({});
    const [dateFilter, setDateFilter] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
        showSizeChanger: false,
    });

    const loadAllFeedbacks = async () => {
        setLoading(true);
        try {
            // Загружаем все отзывы
            const data = await fetchFeedbacksAll();

            if (!data || !data.objectList) {
                throw new Error("Неверный формат данных от сервера");
            }

            setAllFeedbacks(data.objectList);
            setPagination(prev => ({
                ...prev,
                total: data.objectList.length,
            }));

            // Загружаем данные пациентов, врачей и услуг для всех отзывов
            const promises = data.objectList.map(async (feedback) => {
                try {
                    // Загружаем пациента
                    if (feedback.patient) {
                        const patient = await fetchPatient(feedback.patient);
                        const patientName = `${patient.surname} ${patient.name}${patient.patronymic ? ` ${patient.patronymic}` : ''}`;
                        setPatients(prev => ({...prev, [feedback.patient]: patientName}));
                    }

                    // Загружаем врача
                    if (feedback.doctor) {
                        const doctor = await fetchDoctor(feedback.doctor);
                        const doctorName = `${doctor.surname} ${doctor.name}${doctor.patronymic ? ` ${doctor.patronymic}` : ''}`;
                        setDoctors(prev => ({
                            ...prev, [feedback.doctor]: {
                                name: doctorName,
                                specialization: doctor.specialization
                            }
                        }));
                    }

                    // Загружаем услугу
                    if (feedback.service) {
                        const service = await fetchService(feedback.service);
                        setServices(prev => ({...prev, [feedback.service]: service.name}));
                    }
                } catch (error) {
                    console.error("Ошибка загрузки данных:", error);
                }
            });

            await Promise.all(promises);
            applyFiltersAndPagination(data.objectList);
        } catch (error) {
            console.error("Ошибка загрузки отзывов:", error);
            message.error("Ошибка загрузки отзывов");
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndPagination = (feedbacks) => {
        let filtered = feedbacks;

        // Применяем фильтр по дате
        if (dateFilter && dateFilter.length === 2) {
            const [start, end] = dateFilter;
            filtered = filtered.filter(feedback => {
                const feedbackDate = new Date(feedback.creationTime);
                return (!start || feedbackDate >= start.startOf('day')) &&
                    (!end || feedbackDate <= end.endOf('day'));
            });
        }

        // Применяем поиск
        if (searchText) {
            filtered = filterFeedbacks(filtered);
        }

        // Применяем пагинацию
        const {current, pageSize} = pagination;
        const paginated = filtered.slice(
            (current - 1) * pageSize,
            current * pageSize
        );

        setDisplayedFeedbacks(paginated);
        setPagination(prev => ({
            ...prev,
            total: filtered.length,
        }));
    };

    useEffect(() => {
        loadAllFeedbacks();
    }, []);

    useEffect(() => {
        if (allFeedbacks.length > 0) {
            applyFiltersAndPagination(allFeedbacks);
        }
    }, [pagination.current, pagination.pageSize, searchText, dateFilter]);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination(prev => ({...prev, current: 1}));
    };

    const filterFeedbacks = (feedbacks) => {
        const searchLower = searchText.toLowerCase();
        return feedbacks.filter((feedback) => {
            const patientName = feedback.patient ? (patients[feedback.patient]?.toLowerCase() || '-') : '-';
            const comment = feedback.comment ? feedback.comment.toLowerCase() : '';

            return (
                patientName.includes(searchLower) ||
                comment.includes(searchLower) ||
                feedback.rating.toString().includes(searchText) ||
                new Date(feedback.creationTime).toLocaleString().toLowerCase().includes(searchLower)
            );
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
    };

    const formatPatientName = (patientId) => {
        if (!patientId) return '-';
        return patients[patientId] || 'Загрузка...';
    };

    const formatDoctorInfo = (doctorId) => {
        if (!doctorId) return '-';
        const doctor = doctors[doctorId];
        if (!doctor) return 'Загрузка...';
        return `${doctor.name} (${doctor.specialization})`;
    };

    const formatServiceName = (serviceId) => {
        if (!serviceId) return '-';
        return services[serviceId] || 'Загрузка...';
    };

    const columns = [
        {
            title: "Пациент",
            dataIndex: "patient",
            key: "patient",
            render: (patientId) => formatPatientName(patientId),
        },
        {
            title: "Врач",
            dataIndex: "doctor",
            key: "doctor",
            render: (doctorId) => formatDoctorInfo(doctorId),
        },
        {
            title: "Услуга",
            dataIndex: "service",
            key: "service",
            render: (serviceId) => formatServiceName(serviceId),
        },
        {
            title: "ID записи",
            dataIndex: "appointment",
            key: "appointment",
            render: (id) => id || '-',
        },
        {
            title: "Рейтинг",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => <Rate disabled defaultValue={rating}/>,
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: "Комментарий",
            dataIndex: "comment",
            key: "comment",
            render: (comment) => comment || '-',
        },
        {
            title: "Дата создания",
            dataIndex: "creationTime",
            key: "creationTime",
            render: (date) => formatDate(date),
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
        },
    ];

    return (
        <div style={{padding: '0 24px'}}>
            <AdminAppHeader/>
            <div style={{marginBottom: 16}}>
                <Search
                    placeholder="Поиск по пациенту, врачу, комментарию или рейтингу"
                    onSearch={handleSearch}
                    style={{width: '100%'}}
                    allowClear
                    enterButton
                    size="large"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Table
                dataSource={displayedFeedbacks}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                scroll={{x: true}}
            />
        </div>
    );
};

export default AdminFeedbacks;