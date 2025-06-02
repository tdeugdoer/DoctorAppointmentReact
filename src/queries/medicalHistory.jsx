export const fetchDoctorMedicalHistory = async (doctorId) => {
    const response = await fetch(`http://localhost:8888/api/v1/records/doctor/${doctorId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchPatientMedicalHistory = async (patientId) => {
    const response = await fetch(`http://localhost:8888/api/v1/records/patient/${patientId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchAppointmentMedicalHistory = async (appointmentId) => {
    const response = await fetch(`http://localhost:8888/api/v1/records/appointment/${appointmentId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createMedicalRecord = async (medicalRecordRequest, files = []) => {
    try {
        const formData = new FormData();

        // Добавляем JSON-данные медицинской записи
        formData.append(
            'medicalRecordRequest',
            new Blob([JSON.stringify(medicalRecordRequest)], {
                    type: 'application/json'
                }
            ));

        // Добавляем файлы, если они есть
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch(`http://localhost:8085/api/v1/records`, {
            method: 'POST',
            body: formData,
            // headers не нужны, так как FormData сам устанавливает Content-Type с boundary
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании медицинской записи');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка в createMedicalRecord:', error);
        throw error;
    }
};