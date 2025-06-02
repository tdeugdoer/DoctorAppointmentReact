import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./user/Home.jsx";
import Doctors from "./user/Doctors.jsx";
import {QueryClient, QueryClientProvider} from "react-query";
import Services from "./user/Services.jsx";
import AboutUs from "./user/AboutUs.jsx";
import Contacts from "./user/Contacts.jsx";
import AdminDoctors from "./admin/AdminDoctors.jsx";
import AdminAppointments from "./admin/AdminAppointments.jsx";
import AdminPatients from "./admin/AdminPatients.jsx";
import AdminServices from "./admin/AdminServices.jsx";
import AdminFeedbacks from "./admin/AdminFeedbacks.jsx";
import AdminWorkDays from "./admin/AdminWorkDays.jsx";
import PatientProfile from "./auth/PatientProfile.jsx";
import DoctorProfile from "./auth/DoctorProfile.jsx";
import ProtectedRoute from "../security/ProtectedRoute.jsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/doctors" element={<Doctors/>}/>
                    <Route path="/services" element={<Services/>}/>
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/contacts" element={<Contacts/>}/>

                    {/* Защищенные admin-роуты */}
                    <Route path="/admin/doctors" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDoctors/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/admin/appointments" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminAppointments/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/admin/patients" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPatients/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/admin/services" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminServices/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/admin/feedbacks" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminFeedbacks/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/admin/work-days" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminWorkDays/>
                        </ProtectedRoute>
                    }/>

                    <Route path="/profile/patient/:patientId" element={<PatientProfile/>}/>
                    <Route path="/profile/doctor/:doctorId" element={<DoctorProfile/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;