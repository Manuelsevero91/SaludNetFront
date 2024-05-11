import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link si es necesario



const Admin = () => {
  
  const AdminSection = ({ imageSrc, title, onClick }) => {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
      setIsActive(!isActive);
    };

    return (
      <div
        className={`admin-section ${isActive ? 'active' : ''}`}
        style={{ backgroundImage: `url(${imageSrc})` }}
        onMouseEnter={handleToggle}
        onMouseLeave={handleToggle}
        onClick={onClick}
      >
        <div className="title-wrapper">
          <h2>{title}</h2>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-row">
        <div className="admin-column">
          <AdminSection
            imageSrc="https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0="
            title="ADMINISTRAR PROFESIONALES"
            
          />
          <AdminSection
            imageSrc="https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-600nw-2075382679.jpg"
            title="ADMINISTRAR AGENDA"
          />
        </div>
        <div className="admin-column">
          <AdminSection
            imageSrc="https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg"
            title="CONFIRMAR TURNOS"
            icon="fas fa-calendar-days"
          />
          <AdminSection
            imageSrc="https://economia3.com/wp-content/uploads/2021/02/informes_1.jpg"
            title="REPORTES"
          />
        </div>
      </div>


    </div>
  );
};

export default Admin;
