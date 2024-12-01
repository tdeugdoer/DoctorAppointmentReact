import React, {useEffect, useState} from "react";
import {Button, Input, message, Table} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import CreateDoctorModal from "../../widgets/modal/CreateDoctorModal.jsx";
import {deleteDoctor, fetchDoctors} from "../../queries/doctors.jsx";
import UpdateDoctorModal from "../../widgets/modal/UpdateDoctorModal.jsx";

const {Search} = Input;

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false); // Разделение состояний
    const [searchText, setSearchText] = useState("");
    const [hoveredDoctor, setHoveredDoctor] = useState(null);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Новое состояние для выбранного доктора

    const loadDoctors = async () => {
        setLoading(true);
        try {
            const response = await fetchDoctors(0, 50);
            const updatedDoctors = response.objectList.map(doctor => {
                if (doctor.image) {
                    const url = new URL(doctor.image);
                    url.searchParams.set('t', Date.now());
                    return {...doctor, image: url.toString()};
                }
                return doctor;
            });
            setDoctors(updatedDoctors);
        } catch (error) {
            message.error("Error loading doctors' data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
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

    const handleDelete = async (doctorId) => {
        try {
            await deleteDoctor(doctorId);
            message.success("Doctor successfully deleted");
            await loadDoctors();
        } catch (error) {
            message.error("Error deleting doctor");
        }
    };

    const openAddModal = () => {
        setAddModalVisible(true);
    };

    const closeAddModal = async () => {
        setAddModalVisible(false);
        await loadDoctors();
    };

    const openUpdateModal = (doctor) => {
        setSelectedDoctor(doctor); // Устанавливаем выбранного доктора
        setUpdateModalVisible(true); // Открываем модальное окно
    };

    const closeUpdateModal = async () => {
        setUpdateModalVisible(false);
        setSelectedDoctor(null); // Сбрасываем выбранного доктора
        await loadDoctors();
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const searchLower = searchText.toLowerCase();
        return (
            doctor.id.toLowerCase().includes(searchLower) ||
            doctor.name.toLowerCase().includes(searchLower) ||
            doctor.surname.toLowerCase().includes(searchLower) ||
            doctor.specialization.toLowerCase().includes(searchLower) ||
            doctor.gender.toLowerCase().includes(searchLower) ||
            doctor.phoneNumber.toLowerCase().includes(searchLower) ||
            String(doctor.experience).includes(searchLower) ||
            new Date(doctor.birthDate).toLocaleDateString().includes(searchLower)
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
            title: "Specialization",
            dataIndex: "specialization",
            key: "specialization",
            filters: [
                {text: 'Therapy', value: 'Therapy'},
                {text: 'Surgery', value: 'Surgery'},
                {text: 'Pediatrics', value: 'Pediatrics'},
                {text: 'Neurology', value: 'Neurology'},
                {text: 'Dentistry', value: 'Dentistry'},
                {text: 'Gynecology', value: 'Gynecology'},
                {text: 'Dermatological', value: 'Dermatological'},
                {text: 'Other', value: 'Other'},
            ],
            onFilter: (value, record) => record.specialization.includes(value),
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
            title: "Experience",
            dataIndex: "experience",
            key: "experience",
            sorter: (a, b) => a.experience - b.experience,
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

    return (
        <div>
            <AdminAppHeader/>
            <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
                <Button
                    type="primary"
                    style={{fontSize: '16px', padding: '10px 20px'}}
                    onClick={openAddModal}
                >
                    Add Doctor
                </Button>
            </div>
            <Search
                placeholder="Search doctors"
                onSearch={handleSearch}
                style={{marginBottom: 20}}
                allowClear
                enterButton
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                dataSource={filteredDoctors}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{pageSize: 8}}
                onRow={(record) => ({
                    onMouseEnter: () => setHoveredDoctor(record),
                    onMouseLeave: () => setHoveredDoctor(null),
                })}
            />
            <CreateDoctorModal visible={addModalVisible} onClose={closeAddModal}/>
            <UpdateDoctorModal visible={updateModalVisible} onClose={closeUpdateModal} doctor={selectedDoctor}/>
            {hoveredDoctor && (
                <div
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        top: mousePosition.y - 70, // Позиция выше курсора
                        left: mousePosition.x + 10, // Немного вправо от курсора
                        transition: 'transform 0.2s ease', // Плавный переход
                    }}
                >
                    <img
                        src={hoveredDoctor.image}
                        alt="Doctor"
                        style={{
                            width: '100px', // Увеличиваем размер
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

export default AdminDoctors;