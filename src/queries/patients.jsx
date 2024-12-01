export const fetchPatient = async (patientId) => {
    const response = await fetch(`http://localhost:8090/api/v1/patients/${patientId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchPatients = async () => {
    const response = await fetch(`http://localhost:8090/api/v1/patients`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};