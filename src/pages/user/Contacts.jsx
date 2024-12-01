import React from "react";
import {Button, Col, Layout, Row, Select, Typography} from "antd";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {useNavigate} from "react-router-dom";

const {Content} = Layout;
const {Title, Text, Paragraph} = Typography;
const {Option} = Select;

// Пример данных о врачах
const doctors = [
    {id: 1, name: "Dr. Emily Carter", specialization: "Pediatrics"},
    {id: 2, name: "Dr. Michael Smith", specialization: "Dentistry"},
    {id: 3, name: "Dr. Sarah Johnson", specialization: "Therapy"},
    {id: 4, name: "Dr. Andrew Brown", specialization: "Neurology"},
];

const ContactsPage = () => {
    const navigate = useNavigate();

    return (
        <LayoutComponent>
            <Content style={{padding: "80px", paddingLeft: "120px", backgroundColor: "#f0f2f5"}}>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Title level={3}>Contact Us</Title>
                        <Paragraph>
                            <Text strong>Address:</Text> 62 Nezavisimosti Avenue, Minsk, Minsk Region, 220005
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Phone:</Text> +375-29-207-88-76
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Email:</Text> tegor2003@gmail.com
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/doctors")}>
                            Book an Appointment
                        </Button>
                    </Col>

                    <Col>
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d587.4262943924786!2d27.591551325811174!3d53.919214713689016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfa41deb3e1d%3A0x12bb596ad48b9556!2z0L_RgC4g0J3QtdC30LDQstC40YHQuNC80L7RgdGC0LggNjIsINCc0LjQvdGB0LosINCc0LjQvdGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMIDIyMDA4OQ!5e0!3m2!1sru!2sby!4v1732741313519!5m2!1sru!2sby"
                            width="800"
                            height="500"
                            style={{border: "0"}}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </Col>
                </Row>
            </Content>
        </LayoutComponent>
    );
};

export default ContactsPage;