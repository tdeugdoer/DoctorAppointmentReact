export const fetchDoctorWorkDays = async () => {
    const response = await fetch("http://localhost:8082/api/v1/work-days");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createDoctorWorkDay = async (values) => {
    try {
        const response = await fetch(`http://localhost:8082/api/v1/work-days`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();

            // Обработка массива violations
            if (errorData.violations) {
                const errorMessages = errorData.violations.map(v => v.message);
                throw new Error(errorMessages.join('\n'));
            }

            throw new Error(errorData.message || 'Ошибка сервера');
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating doctor work day:", error);
        throw error;
    }
};

export const deleteDoctorWorkDay = async (doctorWorkDayId) => {
    try {
        const response = await fetch(`http://localhost:8082/api/v1/work-days/${doctorWorkDayId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(errorData.message || 'Server error');
        }

        return null;
    } catch (error) {
        console.error("Error deleting doctor work day:", error);
        throw error;
    }
};