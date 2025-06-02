import React, {useEffect, useState} from "react";
import {Button, Input, message, Rate, Table} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import CreateDoctorModal from "../../widgets/modal/CreateDoctorModal.jsx";
import {deleteDoctor, fetchDoctors} from "../../queries/doctors.jsx";
import UpdateDoctorModal from "../../widgets/modal/UpdateDoctorModal.jsx";

const {Search} = Input;

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [hoveredDoctor, setHoveredDoctor] = useState(null);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const loadDoctors = async () => {
        setLoading(true);
        try {
            const response = await fetchDoctors(0, 50);
            const updatedDoctors = response.objectList.map(doctor => {
                if (doctor.image) {
                    const url = new URL(doctor.image);
                    url.searchParams.set('t', Date.now());
                    return {
                        ...doctor,
                        image: url.toString(),
                        rating: doctor.rating || 0 // Добавляем рейтинг, если его нет
                    };
                }
                return {...doctor, rating: doctor.rating || 0};
            });
            setDoctors(updatedDoctors);
        } catch (error) {
            message.error("Ошибка загрузки данных о врачах");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

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
            message.success("Доктор успешно удалён");
            await loadDoctors();
        } catch (error) {
            message.error("Ошибка удаления доктора");
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
        setSelectedDoctor(doctor);
        setUpdateModalVisible(true);
    };

    const closeUpdateModal = async () => {
        setUpdateModalVisible(false);
        setSelectedDoctor(null);
        await loadDoctors();
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const searchLower = searchText.toLowerCase();
        return (
            doctor.name.toLowerCase().includes(searchLower) ||
            doctor.surname.toLowerCase().includes(searchLower) ||
            doctor.specialization.toLowerCase().includes(searchLower) ||
            doctor.gender.toLowerCase().includes(searchLower) ||
            doctor.phoneNumber.toLowerCase().includes(searchLower) ||
            String(doctor.experience).includes(searchLower) ||
            String(doctor.rating).includes(searchLower) || // Добавляем поиск по рейтингу
            new Date(doctor.birthDate).toLocaleDateString().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const columns = [
        {
            title: "Имя",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Фамилия",
            dataIndex: "surname",
            key: "surname",
            sorter: (a, b) => a.surname.localeCompare(b.surname),
        },
        {
            title: "Специализация",
            dataIndex: "specialization",
            key: "specialization",
            filters: [
                {text: 'Терапевт', value: 'Therapy'},
                {text: 'Хирургия', value: 'Surgery'},
                {text: 'Педиатрия', value: 'Pediatrics'},
                {text: 'Неврология', value: 'Neurology'},
                {text: 'Стоматология', value: 'Dentistry'},
                {text: 'Гинекология', value: 'Gynecology'},
                {text: 'Дерматология', value: 'Dermatological'},
                {text: 'Другое', value: 'Other'},
            ],
            onFilter: (value, record) => record.specialization.includes(value),
        },
        {
            title: "Рейтинг",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => <Rate disabled defaultValue={rating}/>,
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: "Пол",
            dataIndex: "gender",
            key: "gender",
            filters: [
                {text: 'Мужской', value: 'Men'},
                {text: 'Женский', value: 'Women'},
            ],
            onFilter: (value, record) => record.gender.includes(value),
        },
        {
            title: "Телефон",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
        },
        {
            title: "Опыт",
            dataIndex: "experience",
            key: "experience",
            sorter: (a, b) => a.experience - b.experience,
        },
        {
            title: "Дата рождения",
            dataIndex: "birthDate",
            key: "birthDate",
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => openUpdateModal(record)} style={{marginRight: 8}}>
                        Обновить
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </>
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
                    onClick={openAddModal}
                >
                    Добавить врача
                </Button>
            </div>
            <Search
                placeholder="Поиск врачей"
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
                        top: mousePosition.y - 70,
                        left: mousePosition.x + 10,
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <img
                        src={hoveredDoctor.image}
                        alt="Доктор"
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

export default AdminDoctors;