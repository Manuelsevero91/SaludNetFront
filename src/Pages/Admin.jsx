import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Componentes/Footer';
import "../Styles/Footer.css";
import NavBar from '../Componentes/NavBar';
import "../Styles/NavBar.css";


const Admin = () => {
  
  const AdminSection = ({ imageSrc, title, options }) => {
  

   
    const [isHovered, setIsHovered] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    const handleTitleClick = () => {
      setIsOptionsVisible(!isOptionsVisible);
    };

    return (
      <div
        className={`admin-section ${isHovered ? 'active' : ''}`}
        style={{ backgroundImage: `url(${imageSrc})` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // onClick={onClick}
      >
        <div className="title-wrapper" onClick={handleTitleClick} > 
        <h2 style={{ display: isOptionsVisible ? 'none' : 'block' }}>{title}</h2>
        </div>
        {isOptionsVisible && (
        <div className="options">
          {options.map((option, index) => (
            <Link key={index} to={option.link}>
              {option.label}
            </Link>
          ))}
      </div>
        )}
        </div>
    );
  };

  return (
   
    <div className="admin-container">
 <NavBar />
      <div className="admin-row">
        <div className="admin-column">
          
        <AdminSection
  imageSrc="https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0="
  title="ADMINISTRAR PROFESIONALES"
  options={[
    { label: 'Agregar Profesional', link: '/FormProfesionals' },
    { label: 'Modificar/Eliminar Profesional', link: '/ListProfesionals' },
    
  ]}
/>

          <AdminSection
            imageSrc="https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-600nw-2075382679.jpg"
            title="ADMINISTRAR AGENDA"
            options={[
              { label: 'Configurar turnos disponibles', link: '/configurar turnos disponibles'},
              { label: 'Actualizar turnos disponibles', link: '/sactualizar turnos disponibles'},
              { label: 'Eliminar turnos disponibles', link: '/eliminar turnos disponibles' }
            ]}
          />
        </div>
        <div className="admin-column">
          <AdminSection
            imageSrc="https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg"
            title="CONFIRMAR TURNOS"
            icon="fas fa-calendar-days"
            options={[
              { label: 'Confirmar turnos reservados', link: '/confirmar turnos reservados' },
              { label: 'Enviar confirmación', link: '/enviar confirmacion' },
              { label: 'Eliminar turnos confirmados', link: '/eliminar turnos confirmados' }
            ]}
          />
          <AdminSection
            imageSrc="https://economia3.com/wp-content/uploads/2021/02/informes_1.jpg"
            title="REPORTES"
            options={[
              { label: 'Todos los turnos de hoy', link: '/todos los turnos de hoy' },
              { label: 'Turnos del mes por médico', link: '/turnos del mes por medico' },
              { label: 'Solicitar turno como paciente', link: '/turnos' }
            ]} 
          />
        </div>
      </div>

<Footer />
    </div>
  );
};

export default Admin;




