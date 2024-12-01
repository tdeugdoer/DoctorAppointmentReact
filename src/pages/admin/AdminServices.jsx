import React, {useEffect, useState} from "react";
import {Button, Input, message, Table} from "antd";
import AdminAppHeader from "../../widgets/AdminAppHeader.jsx";
import {deleteService, fetchServices} from "../../queries/services.jsx"; // Update this import as needed

const {Search} = Input;

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const loadServices = async () => {
        setLoading(true);
        try {
            const response = await fetchServices();
            setServices(response.objectList); // Adjust based on actual response structure
        } catch (error) {
            message.error("Error loading services data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleDelete = async (serviceId) => {
        try {
            await deleteService(serviceId); // Implement deleteService function
            message.success("Service successfully deleted");
            await loadServices();
        } catch (error) {
            message.error("Error deleting service");
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredServices = services.filter((service) => {
        const searchLower = searchText.toLowerCase();
        return (
            service.id.toLowerCase().includes(searchLower) ||
            service.name.toLowerCase().includes(searchLower) ||
            service.specialization.toLowerCase().includes(searchLower) ||
            String(service.price).includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Specialization",
            dataIndex: "specialization",
            key: "specialization",
            sorter: (a, b) => a.specialization.localeCompare(b.specialization),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (text) => `$${text.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
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
        },
    ];

    return (
        <div>
            <AdminAppHeader/>
            <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
                <Button
                    type="primary"
                    style={{fontSize: '16px', padding: '10px 20px'}}
                >
                    Add Service
                </Button>
            </div>
            <Search
                placeholder="Search services"
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