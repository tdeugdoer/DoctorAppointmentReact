import React, {useEffect, useState} from "react";
import {Button, Input, message, Table} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {deleteService, fetchServices} from "../../queries/services.jsx";

const {Search} = Input;

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const loadServices = async () => {
        setLoading(true);
        try {
            const response = await fetchServices();
            setServices(response.objectList);
        } catch (error) {
            message.error("Ошибка загрузки данных о услугах");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleDelete = async (serviceId) => {
        try {
            await deleteService(serviceId);
            message.success("Услуга успешно удалена");
            await loadServices();
        } catch (error) {
            message.error("Ошибка удаления услуги");
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredServices = services.filter((service) => {
        const searchLower = searchText.toLowerCase();
        return (
            service.id.toString().toLowerCase().includes(searchLower) ||
            service.name.toLowerCase().includes(searchLower) ||
            service.specialization.toLowerCase().includes(searchLower) ||
            String(service.price).includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Специализация",
            dataIndex: "specialization",
            key: "specialization",
            sorter: (a, b) => a.specialization.localeCompare(b.specialization),
        },
        {
            title: "Цена",
            dataIndex: "price",
            key: "price",
            render: (text) => `${text.toFixed(2)} р.`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <div style={{display: 'flex', gap: '8px'}}>
                    <Button type="link" onClick={() => openUpdateModal(record)}>
                        Обновить
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </div>
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
                >
                    Добавить услугу
                </Button>
            </div>
            <Search
                placeholder="Поиск услуг"
                onSearch={handleSearch}
                style={{marginBottom: 20}}
                allowClear
                enterButton
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Table
                dataSource={filteredServices}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{pageSize: 8}}
            />
        </div>
    );
};

export default AdminServices;