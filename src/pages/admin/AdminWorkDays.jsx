import React, {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, message, Modal, Select, Table, TimePicker} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {createDoctorWorkDay, deleteDoctorWorkDay, fetchDoctorWorkDays} from "../../queries/doctorWorkDays.jsx";
import {fetchDoctors} from "../../queries/doctors.jsx";
import {fetchServices} from "../../queries/services.jsx";
import dayjs from "dayjs";

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;

const AdminDoctorWorkDays = () => {
    const [workDays, setWorkDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [doctorFilter, setDoctorFilter] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [filteredServices, setFilteredServices] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Загружаем рабочие дни врачей
            const workDaysData = await fetchDoctorWorkDays({});
            setWorkDays(workDaysData.objectList);

            // Загружаем список врачей
            const doctorsData = await fetchDoctors();
            setDoctors(doctorsData.objectList);

            // Загружаем список услуг
            const servicesData = await fetchServices();
            setServices(servicesData.objectList);
            setFilteredServices(servicesData.objectList); // Инициализируем отфильтрованные услуги
        } catch (error) {
            message.error("Ошибка загрузки данных");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDoctorChange = (doctorId) => {
        if (!doctorId) {
            setFilteredServices(services);
            return;
        }

        const selectedDoctor = doctors.find(d => d.id === doctorId);
        if (selectedDoctor) {
            // Фильтруем услуги по специализации врача
            const servicesForDoctor = services.filter(
                service => service.specialization.id === selectedDoctor.specialization.id
            );
            setFilteredServices(servicesForDoctor);

            // Сбрасываем выбранные услуги, если они не соответствуют новой специализации
            const currentServices = form.getFieldValue('services');
            if (currentServices && currentServices.length > 0) {
                const validServices = currentServices.filter(serviceId =>
                    servicesForDoctor.some(s => s.id === serviceId)
                );
                form.setFieldsValue({services: validServices});
            }
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredWorkDays = workDays.filter((workDay) => {
        const searchLower = searchText.toLowerCase();
        const doctorName = `${workDay.doctor.surname} ${workDay.doctor.name}`.toLowerCase();
        const servicesNames = workDay.services.map(s => s.name).join(' ').toLowerCase();
        const workDayId = workDay.id.toLowerCase();

        // Фильтрация по врачу
        if (doctorFilter && workDay.doctor.id !== doctorFilter) {
            return false;
        }

        // Фильтрация по дате
        if (dateFilter && dateFilter.length === 2) {
            const [start, end] = dateFilter;
            const workDayDate = new Date(workDay.date);
            if ((start && workDayDate < start.startOf('day')) ||
                (end && workDayDate > end.endOf('day'))) {
                return false;
            }
        }

        return (
            workDayId.includes(searchLower) ||
            doctorName.includes(searchLower) ||
            servicesNames.includes(searchLower) ||
            workDay.date.toString().includes(searchLower) ||
            `${workDay.workTime.start}-${workDay.workTime.end}`.includes(searchLower)
        );
    });

    const formatTime = (time) => {
        return dayjs(time, 'HH:mm').format('HH:mm');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleCreate = () => {
        form.resetFields();
        setFilteredServices(services); // Сбрасываем фильтр услуг при создании новой записи
        setIsModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
                workTime: {
                    start: values.workTime[0].format('HH:mm'),
                    end: values.workTime[1].format('HH:mm')
                },
                services: values.services || []
            };

            await createDoctorWorkDay(formattedValues);
            message.success('Рабочий день успешно создан!');
            setIsModalVisible(false);
            loadData();
        } catch (error) {
            // Показываем каждое сообщение об ошибке отдельно
            error.message.split('\n').forEach(msg => {
                message.error(msg, 5); // 5 секунд длительность
            });
            console.error("Error creating work day:", error);
        }
    };

    const handleDelete = async (workDayId) => {
        try {
            await deleteDoctorWorkDay(workDayId);
            message.success('Рабочий день успешно удалён!');
            loadData();
        } catch (error) {
            error.message.split('\n').forEach(msg => {
                message.error(msg, 5);
            });
            console.error("Delete failed:", error);
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
            dataIndex: ["doctor"],
            key: "doctor",
            render: (doctor) => `${doctor.surname} ${doctor.name}`,
            filters: doctors.map(doctor => ({
                text: `${doctor.surname} ${doctor.name}`,
                value: doctor.id,
            })),
            onFilter: (value, record) => record.doctor.id === value,
            filteredValue: doctorFilter ? [doctorFilter] : null,
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "date",
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
        {
            title: "Рабочее время",
            dataIndex: "workTime",
            key: "workTime",
            render: (workTime) => `${formatTime(workTime.start)} - ${formatTime(workTime.end)}`,
        },
        {
            title: "Услуги",
            dataIndex: "services",
            key: "services",
            render: (services) => services.map(s => s.name).join(', '),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleDelete(record.id)}>
                    Удалить
                </Button>
            ),
        }
    ];

    return (
        <div style={{padding: '0 24px'}}>
            <AdminAppHeader/>
            <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
                <Button
                    type="primary"
                    style={{fontSize: '16px', padding: '10px 20px'}}
                    onClick={handleCreate}
                >
                    Добавить рабочий день
                </Button>
            </div>
            <Search
                placeholder="Поиск по ID, врачу, услугам или дате"
                onSearch={handleSearch}
                style={{marginBottom: 20}}
                allowClear
                enterButton
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                dataSource={filteredWorkDays}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{pageSize: 8}}
                onChange={(pagination, filters) => {
                    if (filters.doctor) {
                        setDoctorFilter(filters.doctor[0]);
                    } else {
                        setDoctorFilter(null);
                    }
                }}
            />

            <Modal
                title="Добавить рабочий день"
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                okText="Создать"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="doctor"
                        label="Врач"
                        rules={[{required: true, message: 'Выберите врача'}]}
                    >
                        <Select
                            placeholder="Выберите врача"
                            onChange={handleDoctorChange}
                        >
                            {doctors.map(doctor => (
                                <Option key={doctor.id} value={doctor.id}>
                                    {doctor.surname} {doctor.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Дата"
                        rules={[{required: true, message: 'Выберите дату'}]}
                    >
                        <DatePicker style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        name="workTime"
                        label="Рабочее время"
                        rules={[{required: true, message: 'Укажите рабочее время'}]}
                    >
                        <TimePicker.RangePicker
                            format="HH:mm"
                            minuteStep={15}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item
                        name="services"
                        label="Услуги"
                    >
                        <Select mode="multiple" placeholder="Выберите услуги">
                            {filteredServices.map(service => (
                                <Option key={service.id} value={service.id}>
                                    {service.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDoctorWorkDays;