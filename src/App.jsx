import { Routes, Route } from "react-router-dom";
import "./Styles/App.css";
import "./Styles/Home.css";
import "./Styles/Form.css";
import "./Styles/Login.css";
import "./Styles/Coverage.css";
import "./Styles/Profesionales.css";
import "./Styles/CreateSchedule.css";
import "./Styles/SharedStyles/Btn.css";
import "./Styles/SharedStyles/BarraSuperior.css";
import "./Styles/SharedStyles/Calendar.css";
import "./Styles/SharedStyles/BtnEditar.css";
import "./Styles/SharedStyles/FormContainer.css";
import "./Styles/SharedStyles/ErrorSuccesMessage.css";
import "./Styles/SharedStyles/FourSections.css";
import "./Styles/SharedStyles/Slides.css";
import "./Styles/SharedStyles/SearchBar.css";
import "./Styles/SharedStyles/Swal.css";
import "./Styles/SharedStyles/Table.css";
import "./Styles/SharedStyles/Options.css";
import "./Styles/FormProfesionals.css";
import "./Styles/Contacto.css";
import Profesionales from "./Pages/Profesionales";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Contacto from "./Componentes/Contacto";
import Admin from "./Pages/Admin";
import NotFound from "./Pages/NotFound";
import { UserProvider } from "./Componentes/UserContext";
import FormProfesionals from "./Componentes/FormProfesionals";
import ProtectedRoute from "./Auth/ProtectedRoute"
import Turnos from "./Pages/Turnos";
import SobreNosotros from "./Pages/SobreNosotros";
import Novedades from "./Pages/Novedades";
import CreateSchedule from "./Componentes/CreateSchedule";
import ListProfesionals from "./Componentes/ListProfesionals";
import EditShifts from "./Componentes/EditShifts";
import VerTurnos from "./Componentes/VerTurnos";
import DeleteSchedule from "./Componentes/DeleteSchedule";
import DeleteOneSchedule from "./Componentes/DeleteOneSchedule";
import CoverageAndApecialities from "./Componentes/CoverageAndSpecialities";

function App() {

  return (
    <>
      <UserProvider>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profesionales" element={<Profesionales />} />
          <Route exact path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/Admin" element={<Admin />} />
            <Route path="/AgregarProfesional" element={<FormProfesionals />} />
            <Route path="/EditarProfesional" element={<ListProfesionals />} />
            <Route path="/Agenda" element={<CreateSchedule />} />
            <Route path="/EliminarTurnos" element={<EditShifts />} />
            <Route path="/VerTurnos" element={<VerTurnos />} />
            <Route path="/EliminarAgenda" element={<DeleteSchedule />} />
            {/* <Route path="/EliminarUnaAgenda" element={<DeleteOneSchedule />} /> */}
            <Route path="/CoberturaYEspecialidades" element={<CoverageAndApecialities />} />
          </Route>
          <Route path="/Novedades" element={<Novedades />} />
          <Route path="/Turnos" element={<Turnos />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="*" element={<NotFound />} />




        </Routes>
      </UserProvider>

    </>
  );
};

export default App;