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
                    <Route path="/admin/doctors" element={<AdminDoctors/>}/>
                    <Route path="/admin/appointments" element={<AdminAppointments/>}/>
                    <Route path="/admin/patients" element={<AdminPatients/>}/>
                    <Route path="/admin/services" element={<AdminServices/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;