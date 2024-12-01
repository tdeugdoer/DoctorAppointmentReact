export const fetchService = async (serviceId) => {
    const response = await fetch(`http://localhost:8090/api/v1/services/${serviceId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchServices = async () => {
    const response = await fetch(`http://localhost:8090/api/v1/services`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const deleteService = async (serviceId) => {
    const response = await fetch(`http://localhost:8083/api/v1/services/${serviceId}`,
        {
            method: 'DELETE',
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};