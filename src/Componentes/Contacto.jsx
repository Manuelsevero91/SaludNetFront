import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [consulta, setConsulta] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cerrado, setCerrado] = useState(false);
  const [errores, setErrores] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/contacto") {
      setShowContactForm(true);
    }
  }, [location]);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleConsultaChange = (event) => {
    setConsulta(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errores = validarFormulario();
    if (Object.keys(errores).length === 0) {
      console.log("Nombre:", nombre);
      console.log("Email:", email);
      console.log("Consulta:", consulta);
      setEnviado(true);
    } else {
      setErrores(errores);
    }
  };

  const validarFormulario = () => {
    const errores = {};

    if (nombre.trim() === "") {
      errores.nombre = "Este campo es obligatorio";
    }

    if (email.trim() === "") {
      errores.email = "Este campo es obligatorio";
    } else {
      const nombreApellido = nombre.trim().split(" ");
      if (nombreApellido.length < 2) {
        errores.nombre = "Debe ingresar el nombre y apellido";
      }
    }

    if (consulta.trim() === "") {
      errores.consulta = "Este campo es obligatorio";
    }

    if (nombre.trim() !== "" && nombre.indexOf(" ") === -1) {
      errores.nombre = "Debe ingresar el nombre y apellido";
    }

    return errores;
  };

  const handleClose = () => {
    setCerrado(true);
  };

  if (cerrado) {
    return (
      <div className="form-container"></div>
    );
  }

  if (enviado) {
    return (
      <div className="form-container">
        <p id="FormSucces"><strong>Formulario enviado correctamente</strong></p>
      </div>
    );
  }

  return (
    <>
      <NavBar showLinks={false}/>
      <div className="barra-superior">
        <h2 className="titulo-section">Contacto</h2>
      </div>
      <div className="formContainerContacto">
        <form className="createForm" onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Nombre y Apellido</label>
            <input
              type="text"             
              value={nombre}
              onChange={handleNombreChange}
            />
            {errores.nombre && <span className="error-label">{errores.nombre}</span>}
          </div>
          <div className="input-container">
            <label >Correo Electrónico</label>
            <input
              type="email"           
              value={email}
              onChange={handleEmailChange}
            />
            {errores.email && <span className="error-label">{errores.email}</span>}
          </div>
          <div className="input-container">
            <label>Espacio consulta:</label>
            <input
              type="text"
              id="consulta"
              value={consulta}
              onChange={handleConsultaChange}
            />
            {errores.consulta && <span className="error-label">{errores.consulta}</span>}
          </div>
          <button className="btn" type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
};

export default Contacto;
