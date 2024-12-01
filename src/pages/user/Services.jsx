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

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchServices();
                setServices(data.objectList);
                setFilteredServices(data.objectList);
            } catch (error) {
                console.error("Error loading services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search handler
    const handleSearch = (value) => {
        setSearchTerm(value); // Update search term
        const filtered = services.filter((service) =>
            service.name.toLowerCase().includes(value.toLowerCase()) ||
            service.specialization.toLowerCase().includes(value.toLowerCase()) ||
            (service.description && service.description.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredServices(filtered);
    };

    const columns = [
        {
            title: "Service Name",
            dataIndex: "name",
            key: "name",
            render: (name) => <Text strong>{name}</Text>,
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
            onFilter: (value, record) => record.specialization.includes(value)
        },
        {
            title: "Price ($)",
            dataIndex: "price",
            key: "price",
            render: (price) => <Text>${price.toFixed(2)}</Text>,
            sorter: (a, b) => a.price - b.price, // Added sorter
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description) => <Text>{description || "No description"}</Text>,
        },
    ];

    return (
        <LayoutComponent>
            <div style={{padding: "20px", marginTop: "-200px"}}> {/* Removed unnecessary marginTop */}
                <Title level={2}>Medical Services</Title>
                <Space direction="vertical" style={{width: "100%", marginBottom: "20px"}}>
                    <Search
                        placeholder="Search by name, specialization, or description"
                        enterButton="Search"
                        size="large"
                        onSearch={handleSearch}
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Space>
                {loading ? (
                    <Spin size="large"/>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredServices}
                        rowKey="id"
                        pagination={{pageSize: 8}}
                    />
                )}
            </div>
        </LayoutComponent>
    );
};

export default ServicesPage;