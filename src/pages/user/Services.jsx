import React, {useEffect, useState} from "react";
import {Input, Space, Spin, Table, Typography} from "antd";
import {fetchServices} from "../../queries/services.jsx";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";

const {Title, Text} = Typography;
const {Search} = Input;

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchServices();
                setServices(data.objectList);
                setFilteredServices(data.objectList);
            } catch (error) {
                console.error("Ошибка загрузки услуг:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = services.filter((service) =>
            service.name.toLowerCase().includes(value.toLowerCase()) ||
            service.specialization.toLowerCase().includes(value.toLowerCase()) ||
            (service.description && service.description.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredServices(filtered);
    };

    const columns = [
        {
            title: "Название услуги",
            dataIndex: "name",
            key: "name",
            render: (name) => <Text strong>{name}</Text>,
        },
        {
            title: "Специализация",
            dataIndex: "specialization",
            key: "specialization",
            filters: [
                {text: 'Терапевт', value: 'Терапевт'},
                {text: 'Хирургия', value: 'Хирургия'},
                {text: 'Педиатрия', value: 'Педиатрия'},
                {text: 'Неврология', value: 'Неврология'},
                {text: 'Стоматология', value: 'Стоматология'},
                {text: 'Гинекология', value: 'Гинекология'},
                {text: 'Дерматология', value: 'Дерматология'},
                {text: 'Другое', value: 'Другое'},
            ],
            onFilter: (value, record) => record.specialization.includes(value)
        },
        {
            title: "Цена",
            dataIndex: "price",
            key: "price",
            render: (price) => <Text>{price.toFixed(2)} р.</Text>,
            sorter: (a, b) => a.price - b.price,
            width: 100, // Увеличиваем ширину столбца с ценой
        },
        {
            title: "Длительность",
            dataIndex: "duration",
            key: "duration",
            render: (duration) => <Text>{duration} мин.</Text>,
            sorter: (a, b) => a.duration - b.duration,
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
            render: (description) => <Text>{description || "Нет описания"}</Text>,
        },
    ];

    return (
        <LayoutComponent>
            <div style={{
                padding: "50px",
                marginTop: '-30px',
                minHeight: '100vh' // Добавляем минимальную высоту
            }}>
                <Title level={2} style={{textAlign: 'center'}}>Медицинские услуги</Title>
                <Space direction="vertical" style={{width: "100%", marginBottom: "20px"}}>
                    <Search
                        placeholder="Поиск по названию, специализации или описанию"
                        enterButton="Поиск"
                        size="large"
                        onSearch={handleSearch}
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Space>
                {loading ? (
                    <Spin size="large"/>
                ) : (
                    <div style={{
                        width: '100%',
                        overflowX: 'auto'
                    }}>
                        <Table
                            columns={columns}
                            dataSource={filteredServices}
                            rowKey="id"
                            pagination={{pageSize: 8}}
                            style={{
                                width: '1300px',
                            }}
                            scroll={{x: true}}
                        />
                    </div>
                )}
            </div>
        </LayoutComponent>
    );
};

export default ServicesPage;