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
                marginTop: "0px",
                backgroundColor: "#f0f2f5"
            }}> {/* Уменьшенные отступы */}
                <Row gutter={[16, 16]}> {/* Убрано marginBottom у Row */}
                    <Col span={24}>
                        <Title level={3}>Добро пожаловать в наш медицинский центр Zdorowo</Title>
                        <Paragraph style={{
                            fontSize: "16px",
                            lineHeight: "1.5"
                        }}> {/* Слегка уменьшенный межстрочный интервал */}
                            В нашем медицинском центре мы ставим ваше здоровье и благополучие на первое место.
                            Благодаря многолетнему опыту, команде высококвалифицированных специалистов
                            и современным технологиям, мы предлагаем исключительные медицинские услуги.
                            Независимо от того, нужна ли вам плановая проверка или специализированное лечение, мы
                            позаботимся о вас.
                        </Paragraph>
                    </Col>
                </Row>

                {/* Блок преимуществ */}
                <Row gutter={[16, 16]} style={{marginTop: "-10px"}}> {/* Убрано marginBottom у Row */}
                    <Col span={24}>
                        <Title level={4}>Почему стоит выбрать нас?</Title>
                    </Col>
                    <Col span={8}>
                        <Card title="Команда экспертов" bordered={false}
                              style={{textAlign: "center"}}> {/* Убран backgroundColor */}
                            <Paragraph>
                                Наши врачи - лидеры в своих областях, обладающие многолетним
                                опытом для обеспечения наилучшего ухода за пациентами.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Современное оборудование" bordered={false}
                              style={{textAlign: "center"}}> {/* Убран backgroundColor */}
                            <Paragraph>
                                Мы используем новейшее медицинское оборудование и технологии
                                для достижения высочайшей точной диагностики и максимального эффективного лечения.

                            </Paragraph>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Индивидуальный подход" bordered={false}
                              style={{textAlign: "center"}}> {/* Убран backgroundColor */}
                            <Paragraph>
                                Каждый пациент уникален, и мы адаптируем наши услуги под ваши
                                конкретные потребности, обеспечивая комфорт и поддержку.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>

                {/* Блок о преимуществах онлайн-записи */}
                <Row gutter={[16, 16]} style={{marginTop: "-10px"}}> {/* Убрано marginBottom у Row */}
                    <Col span={24}>
                        <Title level={4}>Удобство онлайн-записи</Title>
                        <Paragraph style={{
                            fontSize: "16px",
                            lineHeight: "1.5"
                        }}> {/* Слегка уменьшенный межстрочный интервал */}
                            Мы понимаем, что ваше время ценно. Поэтому мы предлагаем
                            простую систему онлайн-записи, позволяющую записаться
                            на прием в удобное для вас время. Всего несколькими кликами вы можете:
                        </Paragraph>
                        <ul style={{
                            fontSize: "16px",
                            lineHeight: "1.5"
                        }}> {/* Слегка уменьшенный межстрочный интервал */}
                            <li>Выбрать удобные дату и время</li>
                            <li>Выбрать предпочитаемого врача или специалиста</li>
                            <li>Указать необходимые детали для оптимизации вашего визита</li>
                        </ul>
                    </Col>
                </Row>

                {/* Призыв к действию */}
                <Row gutter={[16, 16]} style={{textAlign: "center", marginTop: "-10px"}}> {/* Уменьшен marginTop */}
                    <Col span={24}>
                        <Title level={3}>Готовы сделать следующий шаг?</Title>
                        <Paragraph style={{
                            fontSize: "16px",
                            lineHeight: "1.5"
                        }}> {/* Слегка уменьшенный межстрочный интервал */}
                            Не откладывайте заботу о своем здоровье. Воспользуйтесь нашей удобной системой
                            онлайн-записи, чтобы назначить встречу сегодня, и сделайте первый шаг
                            к более здоровой и счастливой жизни.
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/doctors")}>
                            Записаться на прием
                        </Button>
                    </Col>
                </Row>
            </Content>
        </LayoutComponent>
    );
};

export default AboutUs;