export const fetchFeedbacksAll = async () => {
    const response = await fetch("http://localhost:8888/api/v1/feedbacks");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Добавлен await
};

export const fetchFeedbacks = async (doctorId) => {
    const response = await fetch(`http://localhost:8888/api/v1/feedbacks/feedbacks/${doctorId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createFeedback = async (values) => {
    try {
        const response = await fetch(`http://localhost:8084/api/v1/feedbacks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();

            // Обработка массива violations (если используется Spring Validation)
            if (errorData.violations) {
                const errorMessages = errorData.violations.map(v => v.message);
                throw new Error(errorMessages.join('\n'));
            }

            throw new Error(errorData.message || 'Ошибка сервера');
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating feedback:", error);
        throw error;
    }
};