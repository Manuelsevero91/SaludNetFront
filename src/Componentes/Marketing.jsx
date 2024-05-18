import React, { useState } from "react";
import Profesionales from "../Pages/Profesionales";
import { Link } from "react-router-dom";

const Marketing = () => {
  const [mostrarProfesionales, setMostrarProfesionales] = useState(false);

  const handleMostrarProfesionales = () => {
    setMostrarProfesionales(true);
  };

  return (
    <div className="marketing-container">
      <div className="marketing-row">
        <div className="marketing-column">
          <Link to="/profesionales" style={{ textDecoration: "none" }}>
            <div
              className="marketing-section"
              style={{
                backgroundImage:
                  "url(https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0=)",
              }}
              onMouseEnter={handleMostrarProfesionales}
              onMouseLeave={() => setMostrarProfesionales(false)}
            >
              <div className="title-wrapper">
                <h2>PROFESIONALES</h2>
              </div>
            </div>
          </Link>
          <Link to="/novedades" style={{ textDecoration: "none" }}>
            <div
              className="marketing-section"
              style={{
                backgroundImage:
                  "url(https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-600nw-2075382679.jpg)",
              }}
            >
              <div className="title-wrapper">
                <h2>NOVEDADES</h2>
              </div>
            </div>
          </Link>
        </div>
        <div className="marketing-column">
          <Link to="/turnos" style={{ textDecoration: "none" }}>
            <div
              className="marketing-section"
              style={{
                backgroundImage:
                  "url(https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg)",
              }}
            >
              <div className="title-wrapper">
                <h2>TURNOS</h2>
              </div>
            </div>
          </Link>
          <Link to="/sobre-nosotros" style={{ textDecoration: "none" }}>
            <div
              className="marketing-section"
              style={{
                backgroundImage:
                  "url(https://img.freepik.com/fotos-premium/diversidad-atencion-medica-manos-medicos-asociacion-trabajo-equipo-exito-medicina-apoyo-motivacion-trabajadores-medicos-gesto-mano-mision-ayuda-solidaria-objetivos-colaboracion_590464-153584.jpg)",
              }}
            >
              <div className="title-wrapper">
                <h2>SOBRE NOSOTROS</h2>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div id="final-marketing"></div> {/* Asegúrate de que este ID esté presente */}
      {mostrarProfesionales && <Profesionales />}
    </div>
  );
};

export default Marketing;


