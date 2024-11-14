import AppHeader from "../widgets/AppHeader.jsx";
import {Button, Typography} from "antd";
import React from "react";

const {Title, Paragraph} = Typography;


const Index = () => {
    const handleClick = () => {
        //  должна быть логика обработки нажатия кнопки, но пока она не работает
        console.log('Кнопка нажата!');
    };

    return (
        <div style={{padding: '24px'}}>
            <AppHeader/>
            <Title level={2}>Hello, world!</Title>
            <Paragraph>
                Это пример страницы с текстом "Hello, world!" и неработающей кнопкой.
            </Paragraph>
            <Button type="primary" onClick={handleClick}>
                Привет
            </Button>
        </div>
    );
}

export default Index