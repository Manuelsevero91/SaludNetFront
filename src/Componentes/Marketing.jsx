import React from "react";
import { Link } from "react-router-dom";

const Marketing = () => {
  return (
    <div className="fourSections-container">
      <div className="box" style={{ backgroundImage: `url(https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0=)` }}>
        <Link to="/profesionales">
          <div className="title-wrapper">
            <h2>PROFESIONALES</h2>
          </div>
        </Link>
      </div>
      
      <div className="box" style={{ backgroundImage: `url(https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-600nw-2075382679.jpg)` }}>
        <Link to="/novedades">
          <div className="title-wrapper">
            <h2>NOVEDADES</h2>
          </div>
        </Link>
      </div>
      
      <div className="box" style={{ backgroundImage: `url(https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg)` }}>
        <Link to="/turnos">
          <div className="title-wrapper">
            <h2>TURNOS</h2>
          </div>
        </Link>
      </div>
      
      <div className="box" style={{ backgroundImage: `url(https://img.freepik.com/fotos-premium/diversidad-atencion-medica-manos-medicos-asociacion-trabajo-equipo-exito-medicina-apoyo-motivacion-trabajadores-medicos-gesto-mano-mision-ayuda-solidaria-objetivos-colaboracion_590464-153584.jpg)` }}>
        <Link to="/sobre-nosotros">
          <div className="title-wrapper">
            <h2>SOBRE NOSOTROS</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Marketing;
