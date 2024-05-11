import React, { useState } from 'react';
import NavBar from '../Componentes/NavBar';

import { useAuth } from '../Componentes/UserContext';

function Profesionales() {



  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderTarjetas = () => {
    const tarjetas = [];
    for (let i = 0; i < 9; i++) {
      tarjetas.push(<div key={i} className="tarjeta">Tarjeta {i + 1}</div>);
    }
    return tarjetas;
  };

  return (
    <div className="profesionales">
      
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
