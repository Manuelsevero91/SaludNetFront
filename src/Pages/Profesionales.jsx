import React, { useState } from 'react';
import NavBar from '../Componentes/NavBar';
import profesionalesData from '../Profesionales.json';

import { useAuth } from '../Componentes/UserContext';

function Profesionales() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderTarjetas = () => {
    return profesionalesData.filter(profesional => {
      return profesional.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    }).map((profesional, index) => (
      <div key={index} className="tarjeta">
        <img src={profesional.foto} alt={profesional.nombre} />
        <h3>{profesional.nombre}</h3>
        <p>{profesional.especialidad}</p>
        
      </div>
    ));
  };

  return (
    <div className="profesionales">
      <NavBar />
      <div className="barra-superior">
        <div className="titulo-seccion">Profesionales</div>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Buscar por especialidad"
        className="barra-busqueda"
      />
      <div className="contenedor-tarjetas">
        {renderTarjetas()}
      </div>
    </div>
  );
}

export default Profesionales;
