import {message} from "antd";

export const fetchPatient = async (patientId) => {
    const response = await fetch(`http://localhost:8888/api/v1/patients/${patientId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchPatients = async () => {
    const response = await fetch(`http://localhost:8888/api/v1/patients`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createPatient = async (values, file) => {
    try {
        const formData = new FormData();

        const patientRequest = {
            name: values.name,
            surname: values.surname,
            patronymic: values.patronymic,
            gender: values.gender,
            phoneNumber: values.phoneNumber,
            birthDate: values.birthDate
        };

        formData.append('patientRequest', new Blob([JSON.stringify(patientRequest)], {type: 'application/json'}));

        if (file) {
            formData.append('file', file.originFileObj);
        }

        const response = await fetch(`http://localhost:8888/api/v1/patients`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Patient successfully created!');
        return data;
    } catch (error) {
        message.error(`Error creating patient: ${error.message}`);
        console.error("Error creating patient:", error);
        setError(error.message);
    }
}

export const updatePatient = async (values, file, patient) => {
    try {
        const formData = new FormData();

        // Форматируем дату рождения перед отправкой
        const formattedBirthDate = values.birthDate.format('YYYY-MM-DD');

        const patientRequest = {
            name: values.name,
            surname: values.surname,
            patronymic: values.patronymic,
            gender: values.gender,
            phoneNumber: values.phoneNumber,
            birthDate: formattedBirthDate
        };

        formData.append('patientRequest', new Blob([JSON.stringify(patientRequest)], {
            type: 'application/json'
        }));

        // Добавляем файл только если он был изменен
        if (file) {
            formData.append('file', file.originFileObj);
        } else if (patient.image && !file) {
            // Не отправляем изображение повторно, если оно не изменилось
            // Убираем эту строку, чтобы не отправлять изображение повторно
            // const imageFile = await loadImageAsFile(patient.image);
            // formData.append('file', imageFile);
        }

        const response = await fetch(`http://localhost:8080/api/v1/patients/${patient.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка обновления пациента');
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating patient:", error);
        throw error;
    }
};
