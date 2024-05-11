import React, { useState } from "react";
import Profesionales from "../Pages/Profesionales";
import { Link } from "react-router-dom";

const Marketing = () => {
  const [mostrarProfesionales, setMostrarProfesionales] = useState(false);

  const handleMostrarProfesionales = () => {
    setMostrarProfesionales(true);
  };

  const MarketingSection = ({ imageSrc, title, onClick }) => {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
      setIsActive(!isActive);
    };

    return (
      <div
        className={`marketing-section ${isActive ? "active" : ""}`}
        style={{ backgroundImage: `url(${imageSrc})` }}
        onMouseEnter={handleToggle}
        onMouseLeave={handleToggle}
        onClick={onClick}
      >
        <div className="title-wrapper">
          {" "}
          {/* Envuelve solo el título en este div */}
          <h2>{title}</h2>
        </div>
      </div>
    );
  };

  return (
    <Link to="/profesionales" style={{ textDecoration: "none" }}>
      <div className="marketing-container">
        <div className="marketing-row">
          <div className="marketing-column">
            <MarketingSection
              imageSrc="https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0="
              title="PROFESIONALES"
              onClick={handleMostrarProfesionales}
            />
            <MarketingSection
              imageSrc="https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-600nw-2075382679.jpg"
              title="NOVEDADES"
            />
          </div>
          <div className="marketing-column">
            <MarketingSection
              imageSrc="https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg"
              title="TURNOS"
            />
            <MarketingSection
              imageSrc="https://img.freepik.com/fotos-premium/diversidad-atencion-medica-manos-medicos-asociacion-trabajo-equipo-exito-medicina-apoyo-motivacion-trabajadores-medicos-gesto-mano-mision-ayuda-solidaria-objetivos-colaboracion_590464-153584.jpg"
              title="SOBRE NOSOTROS"
            />
          </div>
          <div id="final-marketing"></div>
        </div>

        {mostrarProfesionales && <Profesionales />}
      </div>
    </Link>
  );
};

export default Marketing;
