import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Form from "../Componentes/Form";
import NavBar from '../Componentes/NavBar';

function Contacto() {
  const location = useLocation();
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (location.pathname === "/contacto") {
      setShowContactForm(true);
    }
  }, [location]);

  const handleSubmit = (formData) => {
    console.log(formData);
  };

  return (
    <>
    
    <NavBar showLinks={false}/>
    <div className="barra-superior-contacto">
      <h1 className="titulo-seccion-contacto">Contacto</h1>
    </div>

    <div>
      {showContactForm && <Form onSubmit={handleSubmit} />}
    </div>
    </>
  );
}


export default Contacto;