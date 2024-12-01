import React from "react";
import {Button, Card, Col, Layout, Row, Typography} from "antd";
import LayoutComponent from "../../widgets/LayoutComponent.jsx";
import {useNavigate} from "react-router-dom";

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <LayoutComponent>
            <Content style={{
                padding: "30px",
                paddingTop: "0px",
                marginTop: "-20px",
                backgroundColor: "#f0f2f5"
            }}> {/* Reduced padding */}
                <Row gutter={[16, 16]}> {/* Removed marginBottom from Row */}
                    <Col span={24}>
                        <Title level={3}>Welcome to Our Medical Center</Title>
                        <Paragraph style={{fontSize: "16px", lineHeight: "1.5"}}> {/* Slightly reduced line height */}
                            At our medical center, we prioritize your health and well-being.
                            With years of experience, a team of highly qualified specialists,
                            and cutting-edge technology, we are here to provide exceptional healthcare services.
                            Whether you need a routine check-up or specialized treatment, we’ve got you covered.
                        </Paragraph>
                    </Col>
                </Row>

                {/* Блок преимуществ */}
                <Row gutter={[16, 16]} style={{marginTop: "-10px"}}> {/* Removed marginBottom from Row */}
                    <Col span={24}>
                        <Title level={4}>Why Choose Us?</Title>
                    </Col>
                    <Col span={8}>
                        <Card title="Expert Team" bordered={false}
                              style={{textAlign: "center"}}> {/* Removed backgroundColor */}
                            <Paragraph>
                                Our doctors are leaders in their fields, bringing decades of
                                expertise to ensure the best possible care for our patients.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Modern Facilities" bordered={false}
                              style={{textAlign: "center"}}> {/* Removed backgroundColor */}
                            <Paragraph>
                                We utilize the latest medical equipment and technologies to
                                provide precise diagnoses and effective treatments.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Personalized Care" bordered={false}
                              style={{textAlign: "center"}}> {/* Removed backgroundColor */}
                            <Paragraph>
                                Every patient is unique, and we tailor our services to meet your
                                specific needs, ensuring a comfortable and supportive experience.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>

                {/* Блок о преимуществах онлайн-записи */}
                <Row gutter={[16, 16]} style={{marginTop: "-10px"}}> {/* Removed marginBottom from Row */}
                    <Col span={24}>
                        <Title level={4}>The Convenience of Online Appointments</Title>
                        <Paragraph style={{fontSize: "16px", lineHeight: "1.5"}}> {/* Slightly reduced line height */}
                            We understand that your time is valuable. That’s why we offer an
                            easy-to-use online appointment system, allowing you to schedule
                            your visit at your convenience. With just a few clicks, you can:
                        </Paragraph>
                        <ul style={{fontSize: "16px", lineHeight: "1.5"}}> {/* Slightly reduced line height */}
                            <li>Choose the date and time that works best for you.</li>
                            <li>Select your preferred doctor or specialist.</li>
                            <li>Provide any necessary details to streamline your visit.</li>
                        </ul>
                    </Col>
                </Row>

                {/* Призыв к действию */}
                <Row gutter={[16, 16]} style={{textAlign: "center", marginTop: "-10px"}}> {/* Reduced marginTop */}
                    <Col span={24}>
                        <Title level={3}>Ready to Take the Next Step?</Title>
                        <Paragraph style={{fontSize: "16px", lineHeight: "1.5"}}> {/* Slightly reduced line height */}
                            Don’t wait to prioritize your health. Use our convenient online
                            booking system to schedule your appointment today and take the first
                            step toward a healthier, happier life.
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/doctors")}>
                            Book an Appointment Now
                        </Button>
                    </Col>
                </Row>
            </Content>
        </LayoutComponent>
    );
};

export default AboutUs;