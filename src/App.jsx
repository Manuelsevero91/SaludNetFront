import { Routes, Route } from "react-router-dom";
import "./Styles/App.css";
import "./Styles/NavBar.css";
import "./Styles/Home.css";
import "./Styles/Form.css";
import "./Styles/Login.css";
import "./Styles/Marketing.css";
import "./Styles/Footer.css";
import "./Styles/Profesionales.css";
import "./Styles/Admin.css";
import "./Styles/SpanContinue.css";
import NavBar from "./Componentes/NavBar";
import Profesionales from "./Pages/Profesionales";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Contacto from "./Pages/Contacto";
import Admin from "./Pages/Admin";
import NotFound from "./Pages/NotFound";

import { UserProvider } from "./Componentes/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profesionales" element={<Profesionales />} />
          <Route exact path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
         
          <Route path="/Admin" element={<Admin />} />
        
          <Route path="*" element={<NotFound />} />
        </Routes>
    
      </UserProvider>
    </>
  );
};

export default App;
