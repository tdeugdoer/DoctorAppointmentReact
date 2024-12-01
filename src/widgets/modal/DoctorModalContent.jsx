import React, {useEffect, useState} from 'react';
import {Input, Spin, Table, Typography} from 'antd';
import {fetchAppointmentsOfDoctor} from "../../queries/appointments.jsx";
import {fetchService} from "../../queries/services.jsx";

const {Text} = Typography;
const {Search} = Input;


export const DoctorModalContent = ({selectedDoctor}) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortedInfo, setSortedInfo] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);


    useEffect(() => {
        const loadAppointments = async () => {
            if (selectedDoctor) {
                setLoading(true);
                try {
                    const appointmentData = await fetchAppointmentsOfDoctor(selectedDoctor.id);
                    const appointmentsWithServices = await Promise.all(
                        appointmentData.filter((appointment) => appointment.status === 'FREE').map(async (appointment) => {
                            const serviceData = await fetchService(appointment.service);
                            return {...appointment, serviceName: serviceData.name};
                        })
                    );
                    setAppointments(appointmentsWithServices);
                    setFilteredAppointments(appointmentsWithServices); // Initialize filteredAppointments
                } catch (error) {
                    console.error('Error loading appointments or services:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadAppointments();
    }, [selectedDoctor]);

    useEffect(() => {
        const filtered = appointments.filter(item => {
            return Object.values(item).some(val =>
                typeof val === 'string' && val.toLowerCase().includes(searchText.toLowerCase())
            );
        });
        setFilteredAppointments(filtered);
    }, [searchText, appointments]);


    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            sortOrder: sortedInfo?.columnKey === 'date' && sortedInfo.order,
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Service',
            dataIndex: 'serviceName',
            key: 'serviceName',
            sorter: (a, b) => a.serviceName.localeCompare(b.serviceName),
            sortOrder: sortedInfo?.columnKey === 'serviceName' && sortedInfo.order,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            sortOrder: sortedInfo?.columnKey === 'price' && sortedInfo.order,
            render: (price) => `${price} $`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Text type="success">Book Appointment</Text>
            ),
        },
    ];

    return selectedDoctor ? (
        <div className="modal-content" style={{display: 'flex', flexDirection: 'column'}}>
            {/* Doctor Information */}
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div className="image-container">
                    {selectedDoctor.image && (
                        <img
                            src={selectedDoctor.image}
                            alt={selectedDoctor.name}
                            style={{maxWidth: '100%', maxHeight: '300px'}}
                        />
                    )}
                </div>
                <div className="text-container" style={{marginLeft: '20px', flexGrow: 1}}>
                    {Object.entries(selectedDoctor).map(([key, value]) => {
                        if (value !== null && key !== 'id' && key !== 'image') {
                            return (
                                <div key={key}>
                                    <p>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</strong> {value}
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>

            {/* Search Bar */}
            <Search
                placeholder="Search appointments..."
                onChange={(e) => setSearchText(e.target.value)}
                style={{marginBottom: 16}}
            />

            {/* Available Appointments */}
            <div style={{marginTop: '10px'}}>
                {loading ? (
                    <Spin/>
                ) : filteredAppointments.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={filteredAppointments}
                        rowKey="id"
                        onChange={handleChange}
                        pagination={{pageSize: 3, style: {marginBottom: '-15px'}}}
                    />
                ) : (
                    <Text type="secondary">No available appointments.</Text>
                )}
            </div>
        </div>
    ) : (
        <p>Select a doctor to see details.</p>
    );
};