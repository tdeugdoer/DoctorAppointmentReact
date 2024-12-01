import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select, Table} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {createAppointment, deleteAppointment, fetchAppointments} from "../../queries/appointments.jsx";
import {fetchDoctor, fetchDoctors} from "../../queries/doctors.jsx";
import {fetchService, fetchServices} from "../../queries/services.jsx";
import {fetchPatient} from "../../queries/patients.jsx";

const {Search} = Input;
const {Option} = Select;

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [doctors, setDoctors] = useState({});
    const [patients, setPatients] = useState({});
    const [services, setServices] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetchAppointments();
            const data = await response.json();
            setAppointments(data.objectList);

            const doctorPromises = data.objectList.map(async (appointment) => {
                const doctor = await fetchDoctor(appointment.doctor);
                const fullName = `${doctor.name} ${doctor.surname}` + (doctor.patronymic ? ` ${doctor.patronymic}` : '');
                setDoctors((prev) => ({...prev, [appointment.doctor]: fullName}));
            });

            const patientPromises = data.objectList.map(async (appointment) => {
                const patient = await fetchPatient(appointment.patient);
                const fullName = `${patient.name} ${patient.surname}` + (patient.patronymic ? ` ${patient.patronymic}` : '');
                setPatients((prev) => ({...prev, [appointment.patient]: fullName}));
            });

            const servicePromises = data.objectList.map(async (appointment) => {
                const service = await fetchService(appointment.service);
                setServices((prev) => ({...prev, [appointment.service]: service.name}));
            });

            await Promise.all([...doctorPromises, ...servicePromises, ...patientPromises]);
        } catch (error) {
            message.error("Error loading appointments data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredAppointments = appointments.filter((appointment) =>
        appointment.id.toLowerCase().includes(searchText.toLowerCase()) ||
        (doctors[appointment.doctor] && doctors[appointment.doctor].toLowerCase().includes(searchText.toLowerCase())) ||
        (patients[appointment.patient] && patients[appointment.patient].toLowerCase().includes(searchText.toLowerCase())) ||
        (services[appointment.service] && services[appointment.service].toLowerCase().includes(searchText.toLowerCase())) ||
        new Date(appointment.date).toLocaleString().includes(searchText.toLowerCase()) ||
        appointment.price.toString().includes(searchText)
    );

    const showModal = async () => {
        if (Object.keys(doctors).length === 0 || Object.keys(services).length === 0) {
            await loadDoctorsAndServices();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleCreate = async (values) => {
        try {
            await createAppointment(values);
            await loadAppointments();
            handleCancel();
        } catch (error) {
            message.error("Error creating appointment: " + error.message);
        }
    };

    const handleDelete = async (appointmentId) => {
        try {
            await deleteAppointment(appointmentId);
            message.success("Appointment successfully deleted");
            await loadAppointments();
        } catch (error) {
            message.error("Error deleting Appointment");
        }
    };

    const loadDoctorsAndServices = async () => {
        try {
            const doctorsData = await fetchDoctors(1, 100); // Fetch doctors, adjust pagination as needed
            const servicesData = await fetchServices();
            setDoctors(
                doctorsData.objectList.reduce((acc, doctor) => {
                    const fullName = `${doctor.name} ${doctor.surname}` + (doctor.patronymic ? ` ${doctor.patronymic}` : '');
                    acc[doctor.id] = fullName;
                    return acc;
                }, {})
            );
            setServices(
                servicesData.objectList.reduce((acc, service) => {
                    acc[service.id] = service.name;
                    return acc;
                }, {})
            );
        } catch (error) {
            message.error("Error loading doctors or services");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Doctor",
            dataIndex: "doctor",
            key: "doctor",
            render: (text) => doctors[text] || text,
            sorter: (a, b) => {
                const nameA = doctors[a.doctor] || "";
                const nameB = doctors[b.doctor] || "";
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: "Service",
            dataIndex: "service",
            key: "service",
            render: (text) => services[text] || text,
            sorter: (a, b) => {
                const nameA = services[a.service] || "";
                const nameB = services[b.service] || "";
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: "Patient",
            dataIndex: "patient",
            key: "patient",
            render: (text) => patients[text] || text,
            sorter: (a, b) => {
                const nameA = patients[a.patient] || "";
                const nameB = patients[b.patient] || "";
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                {text: 'FREE', value: 'FREE'},
                {text: 'BOOKED', value: 'BOOKED'},
                {text: 'COMPLETED', value: 'COMPLETED'}
            ],
            onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (text) => `$${text.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleDelete(record.id)}>
                    Delete
                </Button>
            ),
        }
    ];

    return (
        <div>
            <AdminAppHeader/>
            <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
                <Button
                    type="primary"
                    style={{fontSize: '16px', padding: '10px 20px'}}
                    onClick={showModal}
                >
                    Add Appointment
                </Button>
            </div>
            <Search
                placeholder="Search appointments"
                onSearch={handleSearch}
                style={{marginBottom: 20}}
                allowClear
                enterButton
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                dataSource={filteredAppointments}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{pageSize: 8}}
            />
            <Modal
                title="Create Appointment"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item
                        name="serviceId"
                        label="Service"
                        rules={[{required: true, message: 'Please select a service!'}]}
                    >
                        <Select placeholder="Select a service">
                            {Object.entries(services).map(([id, name]) => (
                                <Option key={id} value={id}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="doctorId"
                        label="Doctor"
                        rules={[{required: true, message: 'Please select a doctor!'}]}
                    >
                        <Select placeholder="Select a doctor">
                            {Object.entries(doctors).map(([id, name]) => (
                                <Option key={id} value={id}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{required: true, message: 'Please select a date!'}]}
                    >
                        <Input type="datetime-local"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Appointment
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminAppointments;