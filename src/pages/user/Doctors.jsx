import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Button, Card, Col, InputNumber, List, Modal, Pagination, Row, Select, Spin, Typography} from 'antd';
import '../../style.css';
import {fetchDoctors} from "../../queries/doctors.jsx";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {DoctorModalContent} from "../../widgets/modal/DoctorModalContent.jsx";

const {Text} = Typography;
const {Option} = Select;

const specializations = [
    'Терапевт', 'Хирургия', 'Педиатрия', 'Неврология', 'Стоматология', 'Гинекология', 'Дерматология', 'Другое'
];

const genders = [
    'Мужской', 'Женский'
];

const sortOptions = [
    {value: 'ID_ASC', label: 'ID (возрастание)'},
    {value: 'ID_DESC', label: 'ID (убывание)'},
    {value: 'NAME_ASC', label: 'Имя (А-Я)'},
    {value: 'NAME_DESC', label: 'Имя (Я-А)'},
    {value: 'SURNAME_ASC', label: 'Фамилия (А-Я)'},
    {value: 'SURNAME_DESC', label: 'Фамилия (Я-А)'},
    {value: 'EXPERIENCE_ASC', label: 'Стаж (возрастание)'},
    {value: 'EXPERIENCE_DESC', label: 'Стаж (убывание)'}
];

const PAGE_SIZE = 12;

const Doctors = () => {
    const [allDoctors, setAllDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('ID_ASC');
    const [filterSpecialization, setFilterSpecialization] = useState(undefined);
    const [filterGender, setFilterGender] = useState(undefined);
    const [filterExperienceRange, setFilterExperienceRange] = useState([null, null]);

    // Загрузка всех врачей при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchDoctors();
                setAllDoctors(data.objectList || data); // В зависимости от формата ответа
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Функции для фильтрации и сортировки
    const filteredDoctors = useMemo(() => {
        return allDoctors.filter(doctor => {
            // Фильтрация по специализации
            if (filterSpecialization && doctor.specialization !== filterSpecialization) {
                return false;
            }

            // Фильтрация по полу
            if (filterGender && doctor.gender !== filterGender) {
                return false;
            }

            // Фильтрация по стажу
            if (filterExperienceRange[0] !== null && doctor.experience < filterExperienceRange[0]) {
                return false;
            }
            return !(filterExperienceRange[1] !== null && doctor.experience > filterExperienceRange[1]);


        });
    }, [allDoctors, filterSpecialization, filterGender, filterExperienceRange]);

    const sortedDoctors = useMemo(() => {
        const doctorsCopy = [...filteredDoctors];

        switch (sortBy) {
            case 'ID_ASC':
                return doctorsCopy.sort((a, b) => a.id - b.id);
            case 'ID_DESC':
                return doctorsCopy.sort((a, b) => b.id - a.id);
            case 'NAME_ASC':
                return doctorsCopy.sort((a, b) => a.name.localeCompare(b.name));
            case 'NAME_DESC':
                return doctorsCopy.sort((a, b) => b.name.localeCompare(a.name));
            case 'SURNAME_ASC':
                return doctorsCopy.sort((a, b) => a.surname.localeCompare(b.surname));
            case 'SURNAME_DESC':
                return doctorsCopy.sort((a, b) => b.surname.localeCompare(a.surname));
            case 'EXPERIENCE_ASC':
                return doctorsCopy.sort((a, b) => a.experience - b.experience);
            case 'EXPERIENCE_DESC':
                return doctorsCopy.sort((a, b) => b.experience - a.experience);
            default:
                return doctorsCopy;
        }
    }, [filteredDoctors, sortBy]);

    // Пагинация
    const paginatedDoctors = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return sortedDoctors.slice(startIndex, startIndex + PAGE_SIZE);
    }, [sortedDoctors, currentPage]);

    const totalItems = filteredDoctors.length;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilterSpecialization(undefined);
        setFilterGender(undefined);
        setFilterExperienceRange([null, null]);
        setSortBy('ID_ASC');
        setCurrentPage(1);
    };

    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalVisible(true);
    };

    return (
        <LayoutComponent>
            <div className="doctor-list-container" style={{padding: '24px'}}>
                {/* Фильтры и сортировка */}
                <div style={{
                    marginBottom: '24px',
                    padding: '16px',
                    background: '#f0f2f5',
                    borderRadius: '8px',
                }}>
                    <Row gutter={[16, 16]} align="middle">
                        {/* Сортировка */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Сортировка:</Text>
                            <Select
                                style={{width: '100%'}}
                                onChange={handleSortChange}
                                value={sortBy}
                            >
                                {sortOptions.map(option => (
                                    <Option key={option.value} value={option.value}>{option.label}</Option>
                                ))}
                            </Select>
                        </Col>

                        {/* Специализация */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Специализация:</Text>
                            <Select
                                allowClear
                                placeholder="Все специализации"
                                style={{width: '100%'}}
                                onChange={(value) => setFilterSpecialization(value)}
                                value={filterSpecialization}
                            >
                                {specializations.map(spec => (
                                    <Option key={spec} value={spec}>{spec}</Option>
                                ))}
                            </Select>
                        </Col>

                        {/* Пол */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Пол:</Text>
                            <Select
                                allowClear
                                placeholder="Любой пол"
                                style={{width: '100%'}}
                                onChange={(value) => setFilterGender(value)}
                                value={filterGender}
                            >
                                {genders.map(gender => (
                                    <Option key={gender} value={gender}>{gender}</Option>
                                ))}
                            </Select>
                        </Col>

                        {/* Стаж */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Стаж (лет):</Text>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <InputNumber
                                    placeholder="От"
                                    style={{width: '100%'}}
                                    min={0}
                                    value={filterExperienceRange[0]}
                                    onChange={(value) => setFilterExperienceRange([value, filterExperienceRange[1]])}
                                />
                                <InputNumber
                                    placeholder="До"
                                    style={{width: '100%'}}
                                    min={filterExperienceRange[0] || 0}
                                    value={filterExperienceRange[1]}
                                    onChange={(value) => setFilterExperienceRange([filterExperienceRange[0], value])}
                                />
                            </div>
                        </Col>

                        {/* Кнопки применения и сброса фильтров */}
                        <Col xs={24} style={{textAlign: 'center', marginTop: '16px'}}>
                            <Button
                                type="primary"
                                onClick={handleFilterChange}
                                style={{marginRight: '8px'}}
                            >
                                Применить
                            </Button>
                            <Button
                                type="default"
                                onClick={resetFilters}
                            >
                                Сбросить
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Список врачей */}
                <Spin spinning={loading}>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                        }}
                        dataSource={paginatedDoctors}
                        renderItem={(doctor) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    onClick={() => handleDoctorClick(doctor)}
                                    style={{
                                        height: '350px',
                                        marginBottom: '16px'
                                    }}
                                    cover={
                                        <div style={{height: '250px', overflow: 'hidden'}}>
                                            <Avatar
                                                src={doctor.image}
                                                shape="square"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        title={`${doctor.surname} ${doctor.name} ${doctor.patronymic || ''}`}
                                        description={doctor.specialization}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Spin>

                {/* Пагинация */}
                <div style={{marginTop: '24px', textAlign: 'center'}}>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={totalItems}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        disabled={loading || totalItems <= PAGE_SIZE}
                    />
                </div>

                {/* Модальное окно */}
                <Modal
                    title="Информация о враче"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    width={800}
                    footer={null}
                    centered
                >
                    {selectedDoctor && <DoctorModalContent selectedDoctor={selectedDoctor}/>}
                </Modal>
            </div>
        </LayoutComponent>
    );
};

export default Doctors;