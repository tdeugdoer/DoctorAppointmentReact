import React, {useEffect, useState} from "react";
import {Button, DatePicker, Input, message, Popconfirm, Table, Typography} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {completeAppointment, fetchAppointments} from "../../queries/appointments.jsx";
import {fetchPatient} from "../../queries/patients.jsx";

const {Search} = Input;
const {Text} = Typography;
const {RangePicker} = DatePicker;

const AdminAppointments = () => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [displayedAppointments, setDisplayedAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [patients, setPatients] = useState({});
    const [dateFilter, setDateFilter] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
        showSizeChanger: false,
    });

    const loadAllAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetchAppointments();
            const data = await response.json();

            setAllAppointments(data.objectList);
            setPagination(prev => ({
                ...prev,
                total: data.objectList.length,
            }));

            const patientPromises = data.objectList
                .filter(appointment => appointment.patient)
                .map(async (appointment) => {
                    try {
                        const patient = await fetchPatient(appointment.patient);
                        const fullName = `${patient.surname} ${patient.name}${patient.patronymic ? ` ${patient.patronymic}` : ''}`;
                        setPatients(prev => ({...prev, [appointment.patient]: fullName}));
                    } catch (error) {
                        console.error("Ошибка загрузки данных пациента:", error);
                        setPatients(prev => ({...prev, [appointment.patient]: '-'}));
                    }
                });

            await Promise.all(patientPromises);
            applyFiltersAndPagination(data.objectList);
        } catch (error) {
            console.error("Ошибка загрузки данных о записях:", error);
            message.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndPagination = (appointments) => {
        let filtered = appointments;

        // Применяем фильтр по дате
        if (dateFilter && dateFilter.length === 2) {
            const [start, end] = dateFilter;
            filtered = filtered.filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                return (!start || appointmentDate >= start.startOf('day')) &&
                    (!end || appointmentDate <= end.endOf('day'));
            });
        }

        // Применяем поиск
        if (searchText) {
            filtered = filterAppointments(filtered);
        }

        // Применяем пагинацию
        const {current, pageSize} = pagination;
        const paginated = filtered.slice(
            (current - 1) * pageSize,
            current * pageSize
        );

        setDisplayedAppointments(paginated);
        setPagination(prev => ({
            ...prev,
            total: filtered.length,
        }));
    };

    useEffect(() => {
        loadAllAppointments();
    }, []);

    useEffect(() => {
        if (allAppointments.length > 0) {
            applyFiltersAndPagination(allAppointments);
        }
    }, [pagination.current, pagination.pageSize, searchText, dateFilter]);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination(prev => ({...prev, current: 1}));
    };

    const handleCompleteAppointment = async (appointmentId) => {
        try {
            await completeAppointment(appointmentId);
            // Обновляем данные после успешного завершения
            await loadAllAppointments();
        } catch (error) {
            console.error('Ошибка при завершении приема:', error);
        }
    };

    const filterAppointments = (appointments) => {
        const searchLower = searchText.toLowerCase();
        return appointments.filter((appointment) => {
            const doctorName = `${appointment.doctor.surname} ${appointment.doctor.name}${appointment.doctor.patronymic ? ` ${appointment.doctor.patronymic}` : ''}`.toLowerCase();
            const servicesText = appointment.service.map(s => s.name).join(';').toLowerCase();
            const patientName = appointment.patient ? (patients[appointment.patient]?.toLowerCase() || '-') : '-';

            return (
                appointment.id.toLowerCase().includes(searchLower) || // Добавлен поиск по ID
                doctorName.includes(searchLower) ||
                servicesText.includes(searchLower) ||
                patientName.includes(searchLower) ||
                appointment.doctor.specialization.toLowerCase().includes(searchLower) ||
                appointment.doctorWorkDayId.toLowerCase().includes(searchLower) ||
                new Date(appointment.date).toLocaleString().toLowerCase().includes(searchLower) ||
                appointment.status.toLowerCase().includes(searchLower)
            );
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
    };

    const formatServices = (services) => {
        return services.map(service => service.name).join("; ");
    };

    const formatPriceRange = (services) => {
        if (!services || services.length === 0) return '0.00 руб.';
        if (services.length === 1) {
            return `${services[0].price?.toFixed(2) || '0.00'} руб.`;
        }

        const prices = services.map(service => service.price || 0);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return `${min.toFixed(2)}-${max.toFixed(2)} руб.`;
    };

    const formatDoctorName = (doctor) => {
        return `${doctor.surname} ${doctor.name}${doctor.patronymic ? ` ${doctor.patronymic}` : ''}`;
    };

    const formatPatientName = (patientId) => {
        if (!patientId) return '-';
        return patients[patientId] || 'Загрузка...';
    };

    const getRowClassName = (record) => {
        switch (record.status) {
            case 'FREE':
                return 'row-status-free';
            case 'BOOKED':
                return 'row-status-booked';
            case 'COMPLETED':
                return 'row-status-completed';
            default:
                return '';
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Врач",
            dataIndex: "doctor",
            key: "doctor",
            render: (doctor) => <Text strong>{formatDoctorName(doctor)}</Text>,
        },
        {
            title: "Специализация",
            dataIndex: "doctor",
            key: "specialization",
            render: (doctor) => doctor.specialization,
        },
        {
            title: "ID рабочего дня",
            dataIndex: "doctorWorkDayId",
            key: "doctorWorkDayId",
        },
        {
            title: "Пациент",
            dataIndex: "patient",
            key: "patient",
            render: (patientId) => formatPatientName(patientId),
        },
        {
            title: "Услуги",
            dataIndex: "service",
            key: "service",
            render: (services) => formatServices(services),
        },
        {
            title: "Стоимость",
            dataIndex: "service",
            key: "price",
            render: (services) => formatPriceRange(services),
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let statusText = '';
                let color = '';

                switch (status) {
                    case 'FREE':
                        statusText = 'Свободно';
                        color = 'green';
                        break;
                    case 'BOOKED':
                        statusText = 'Забронировано';
                        color = 'orange';
                        break;
                    case 'COMPLETED':
                        statusText = 'Завершено';
                        color = 'red';
                        break;
                    default:
                        statusText = status;
                }

                return <Text type={color}>{statusText}</Text>;
            },
            filters: [
                {text: 'Свободно', value: 'FREE'},
                {text: 'Забронировано', value: 'BOOKED'},
                {text: 'Завершено', value: 'COMPLETED'}
            ],
            onFilter: (value, record) => record.status === value,
        },
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
            render: (date) => formatDate(date),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => {
                if (record.status === 'BOOKED') {
                    return (
                        <Popconfirm
                            title="Вы уверены, что хотите завершить этот прием?"
                            onConfirm={() => handleCompleteAppointment(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="primary" size="small">
                                Завершить
                            </Button>
                        </Popconfirm>
                    );
                }
                return null;
            },
        }
    ];

    return (
        <div style={{padding: '0 24px'}}>
            <AdminAppHeader/>
            <div style={{marginBottom: 16}}>
                <Search
                    placeholder="Поиск по ID, врачу, пациенту, услугам или специализации" // Обновлен placeholder
                    onSearch={handleSearch}
                    style={{width: '100%'}}
                    allowClear
                    enterButton
                    size="large"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Table
                dataSource={displayedAppointments}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                scroll={{x: true}}
                rowClassName={getRowClassName}
            />
        </div>
    );
};

export default AdminAppointments;