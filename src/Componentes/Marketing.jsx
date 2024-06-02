import React from "react";
import { Link } from "react-router-dom";


const Marketing = () => {
  const MarketingSection = ({ imageSrc, title, link }) => {
    return (
      <Link to={link} >
        <div
          className="four-section"
          style={{ backgroundImage: `url(${imageSrc})` }}
        >
          <div className="title-wrapper">
            <h2>{title}</h2>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="fourSections-container">
      <div className="fourSections-row">
        <div className="fourSections-column">
          <MarketingSection
            imageSrc="https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0="
            title="PROFESIONALES"
            link="/profesionales"
          />
          <MarketingSection
            imageSrc="https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-600nw-2075382679.jpg"
            title="NOVEDADES"
            link="/novedades"
          />
        </div>
        <div className="marketing-column">
          <MarketingSection
            imageSrc="https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg"
            title="TURNOS"
            link="/turnos"
          />
          <MarketingSection
            imageSrc="https://img.freepik.com/fotos-premium/diversidad-atencion-medica-manos-medicos-asociacion-trabajo-equipo-exito-medicina-apoyo-motivacion-trabajadores-medicos-gesto-mano-mision-ayuda-solidaria-objetivos-colaboracion_590464-153584.jpg"
            title="SOBRE NOSOTROS"
            link="/sobre-nosotros"
          />
        </div>
      </div>
    </div>
  );
};

export default Marketing;

