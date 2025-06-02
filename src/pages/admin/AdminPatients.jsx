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
            message.error("Ошибка загрузки данных о пациентах");
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
            patient.id.toString().toLowerCase().includes(searchLower) ||
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
            title: "Отчество",
            dataIndex: "patronymic",
            key: "patronymic",
            render: (text) => text || "—",
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
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </>
            ),
        }
    ];

    const handleDelete = async (patientId) => {
        // Здесь можно добавить запрос на удаление пациента
        message.info(`Удаление пациента с ID: ${patientId}`);
    };

    return (
        <div style={{padding: '0 24px'}}>
            <AdminAppHeader/>
            <Search
                placeholder="Поиск пациентов"
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
                        alt="Пациент"
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