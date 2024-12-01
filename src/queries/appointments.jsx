import {message} from "antd";

export const fetchAppointments = async () => {
    const response = await fetch(`http://localhost:8090/api/v1/appointments`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
};

export const fetchAppointmentsOfDoctor = async (doctorId) => {
    const response = await fetch(`http://localhost:8090/api/v1/appointments/free/${doctorId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createAppointment = async (values) => {
    const appointmentRequest = {
        service: values.serviceId,
        doctor: values.doctorId,
        date: values.date,
    };

    const response = await fetch(`http://localhost:8082/api/v1/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Установка заголовка
        },
        body: JSON.stringify(appointmentRequest), // Сериализация объекта в JSON
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Network response was not ok';
        throw new Error(errorMessage);
    }

    const data = await response.json();
    message.success('Appointment successfully created!');
    return data;
};

export const deleteAppointment = async (appointmentId) => {
    const response = await fetch(`http://localhost:8082/api/v1/appointments/${appointmentId}`,
        {
            method: 'DELETE',
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};