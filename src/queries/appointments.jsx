import {message} from "antd";

export const fetchAppointments = async () => {
    const response = await fetch(`http://localhost:8082/api/v1/appointments`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
};

export const fetchFreeAppointmentsOfDoctor = async (doctorId) => {
    const response = await fetch(`http://localhost:8082/api/v1/appointments/free/${doctorId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchAppointmentsOfDoctor = async (doctorId) => {
    const response = await fetch(`http://localhost:8082/api/v1/appointments/doctor/${doctorId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchAppointmentsOfPatient = async (patientId) => {
    const response = await fetch(`http://localhost:8082/api/v1/appointments/patient/${patientId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const completeAppointment = async (appointmentId) => {
    try {
        const response = await fetch(`http://localhost:8082/api/v1/appointments/complete/${appointmentId}`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Прием успешно завершен!');
        return data;
    } catch (error) {
        message.error(`Ошибка при завершении приема: ${error.message}`);
        throw error;
    }
};

export const freeAppointment = async (appointmentId) => {
    try {
        const response = await fetch(`http://localhost:8082/api/v1/appointments/free/${appointmentId}`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Прием успешно отменён!');
        return data;
    } catch (error) {
        message.error(`Ошибка при отмене приема: ${error.message}`);
        throw error;
    }
};

export const bookAppointment = async (appointmentId, serviceId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        message.warning('Для записи необходимо аутентифицироваться');
        return;
    }

    if (currentUser.role !== 'patient') {
        message.warning('Для записи необходима роль пациента');
        return;
    }

    const patientId = currentUser.id;

    if (!patientId) {
        message.error('Не удалось определить ID пациента');
        return;
    }

    try {
        const response = await fetch('http://localhost:8082/api/v1/appointments/book', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                appointmentId,
                patientId,
                serviceId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при записи на прием');
        }

        const data = await response.json();
        message.success('Вы успешно записаны на прием!');
        return data;
    } catch (error) {
        message.error(`Ошибка при записи: ${error.message}`);
        throw error;
    }
};

