import React from "react";
import {Button, Col, Layout, Row, Select, Typography} from "antd";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {useNavigate} from "react-router-dom";
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";

const {Content} = Layout;
const {Title, Text, Paragraph} = Typography;
const {Option} = Select;

// Пример данных о врачах
const doctors = [
    {id: 1, name: "Доктор Эмили Картер", specialization: "Педиатрия"},
    {id: 2, name: "Доктор Майкл Смит", specialization: "Стоматология"},
    {id: 3, name: "Доктор Сара Джонсон", specialization: "Терапевт"},
    {id: 4, name: "Доктор Эндрю Браун", specialization: "Неврология"},
];

const ContactsPage = () => {
    const navigate = useNavigate();

    return (
        <LayoutComponent>
            <Content style={{padding: "80px", paddingLeft: "120px", backgroundColor: "#f0f2f5"}}>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Title level={3}>Контакты</Title>
                        <Paragraph>
                            <Text strong>Адрес:</Text> пр-т Независимости, 62, Минск, 220005
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Телефон:</Text> +375-29-207-88-76
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Email:</Text> tegor2003@gmail.com
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/doctors")}>
                            Записаться на прием
                        </Button>
                    </Col>

                    <Col span={16}>
                        <YMaps>
                            <Map
                                defaultState={{center: [53.917846, 27.589149], zoom: 15}}
                                width="100%"
                                height="500px" // можно изменить на другой размер, например "600px"
                            >
                                <Placemark defaultGeometry={[53.917846, 27.589149]}/>
                            </Map>
                        </YMaps>
                    </Col>
                </Row>
            </Content>
        </LayoutComponent>
    );
};

export default ContactsPage;