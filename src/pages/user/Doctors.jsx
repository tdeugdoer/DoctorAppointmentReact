import React, {useEffect, useState} from 'react';
import {Avatar, Card, List, Modal, Spin} from 'antd';
import '../../style.css';
import {fetchDoctors} from "../../queries/doctors.jsx";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {DoctorModalContent} from "../../widgets/modal/DoctorModalContent.jsx";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchDoctors(0, 20);
                setDoctors(data.objectList);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <LayoutComponent>
            <div className="doctor-list-container">
                <Spin spinning={loading}>
                    <List
                        grid={{
                            gutter: 50,
                            xs: 4,
                            sm: 4,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                        }}
                        dataSource={doctors}
                        renderItem={(doctor) => (
                            <List.Item onClick={() => handleDoctorClick(doctor)}>
                                <Card
                                    hoverable
                                    cover={<Avatar src={doctor.image} size={318}/>}
                                >
                                    <Card.Meta
                                        title={`${doctor.name} ${doctor.surname} ${doctor.patronymic || ''}`}
                                        description={doctor.specialization}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Spin>
                <Modal title="Doctor Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                       width={700} className="wider-modal"
                       style={{marginTop: "-30px"}}
                       footer={() => {
                       }}>
                    <DoctorModalContent selectedDoctor={selectedDoctor}/>
                </Modal>
            </div>
        </LayoutComponent>
    );
};

export default Doctors;