import React, {useEffect, useState} from "react";
import {Button, Input, message, Table} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {fetchPatients} from "../../queries/patients.jsx";

const {Search} = Input;

const AdminPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [hoveredPatient, setHoveredPatient] = useState(null);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const loadPatients = async () => {
        setLoading(true);
        try {
            const response = await fetchPatients();
            const updatedPatients = response.objectList.map(patient => {
                if (patient.image) {
                    const url = new URL(patient.image);
                    url.searchParams.set('t', Date.now()); // Для предотвращения кеширования
                    return {...patient, image: url.toString()};
                }
                return patient;
            });
            setPatients(updatedPatients);
        } catch (error) {
            message.error("Error loading patients' data");
        } finally {
            setLoading(false);
        }
    };

    // Загружаем пациентов при монтировании компонента
    useEffect(() => {
        loadPatients();
    }, []);

    // Отслеживание позиции курсора
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({x: e.clientX, y: e.clientY});
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredPatients = patients.filter((patient) => {
        const searchLower = searchText.toLowerCase();
        return (
            patient.id.toLowerCase().includes(searchLower) ||
            patient.name.toLowerCase().includes(searchLower) ||
            patient.surname.toLowerCase().includes(searchLower) ||
            (patient.patronymic && patient.patronymic.toLowerCase().includes(searchLower)) ||
            patient.gender.toLowerCase().includes(searchLower) ||
            patient.phoneNumber.toLowerCase().includes(searchLower) ||
            new Date(patient.birthDate).toLocaleDateString().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "First Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Last Name",
            dataIndex: "surname",
            key: "surname",
            sorter: (a, b) => a.surname.localeCompare(b.surname),
        },
        {
            title: "Patronymic",
            dataIndex: "patronymic",
            key: "patronymic",
            render: (text) => text || "—",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            filters: [
                {text: 'Male', value: 'Men'},
                {text: 'Female', value: 'Women'},
            ],
            onFilter: (value, record) => record.gender.includes(value),
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
        },
        {
            title: "Birth Date",
            dataIndex: "birthDate",
            key: "birthDate",
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => openUpdateModal(record)} style={{marginRight: 8}}>
                        Update
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </>
            ),
        }
    ];

    const handleDelete = async (patientId) => {
        // Здесь можно добавить запрос на удаление пациента
        message.info(`Deleting patient with ID: ${patientId}`);
    };

    return (
        <div>
            <AdminAppHeader/>
            <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
                <Button
                    type="primary"
                    style={{fontSize: '16px', padding: '10px 20px'}}
                >
                    Add Patient
                </Button>
            </div>
            <Search
                placeholder="Search patients"
                onSearch={handleSearch}
                style={{marginBottom: 20}}
                allowClear
                enterButton
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                dataSource={filteredPatients}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{pageSize: 8}}
                onRow={(record) => ({
                    onMouseEnter: () => setHoveredPatient(record),
                    onMouseLeave: () => setHoveredPatient(null),
                })}
            />
            {hoveredPatient && (
                <div
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        top: mousePosition.y - 70,
                        left: mousePosition.x + 10,
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <img
                        src={hoveredPatient.image}
                        alt="Patient"
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '5px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminPatients;