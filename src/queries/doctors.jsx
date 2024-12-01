import {message} from "antd";

export const fetchDoctor = async (doctorId) => {
    const response = await fetch(`http://localhost:8090/api/v1/doctors/${doctorId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchDoctors = async (pageNumber, pageSize) => {
    const response = await fetch(`http://localhost:8090/api/v1/doctors?page=${pageNumber}&limit=${pageSize}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createDoctor = async (values, file) => {
    try {
        const formData = new FormData();

        const doctorRequest = {
            name: values.name,
            surname: values.surname,
            patronymic: values.patronymic,
            specialization: values.specialization,
            gender: values.gender,
            phoneNumber: values.phoneNumber,
            experience: values.experience,
            birthDate: values.birthDate
        };

        formData.append('doctorRequest', new Blob([JSON.stringify(doctorRequest)], {type: 'application/json'}));

        if (file) {
            formData.append('file', file.originFileObj);
        }

        const response = await fetch(`http://localhost:8090/api/v1/doctors`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Doctor successfully created!');
        return data;
    } catch (error) {
        message.error(`Error creating doctor: ${error.message}`);
        console.error("Error creating doctor:", error);
        setError(error.message);
    }
}

export const updateDoctor = async (values, file, doctor) => {
    try {
        const formData = new FormData();

        const doctorRequest = {
            name: values.name,
            surname: values.surname,
            patronymic: values.patronymic,
            specialization: values.specialization,
            gender: values.gender,
            phoneNumber: values.phoneNumber,
            experience: values.experience,
            birthDate: values.birthDate
        };

        console.log(doctorRequest)

        formData.append('doctorRequest', new Blob([JSON.stringify(doctorRequest)], {type: 'application/json'}));

        if (file) {
            formData.append('file', file.originFileObj);
        } else {
            const imageFile = await loadImageAsFile(doctor.image);
            formData.append('file', imageFile);
        }

        const response = await fetch(`http://localhost:8081/api/v1/doctors/${doctor.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Doctor successfully updated!');
        return data;
    } catch (error) {
        message.error(`Error updating doctor: ${error.message}`);
        console.error("Error updating doctor:", error);
        setError(error.message);
    }
}

const loadImageAsFile = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], 'doctorImage.jpg', {type: blob.type});
};

export const deleteDoctor = async (doctorId) => {
    const response = await fetch(`http://localhost:8081/api/v1/doctors/${doctorId}`,
        {
            method: 'DELETE',
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};