import React, { useState } from "react";
import ListCoverage from "../Componentes/Coverage";
import ListSpeciality from "../Componentes/Speciality";


function InformacionAdicional() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleShowCoverage = () => {
    setSelectedComponent('coverage');
  };

  const handleShowSpeciality = () => {
    setSelectedComponent('speciality');
  };


  

  return (
    <div>
      {selectedComponent === null && (
        <>
          <button onClick={handleShowCoverage}>
            Listado de Obras Sociales
          </button>
          <button onClick={handleShowSpeciality}>
            Listado de Especialidades
          </button>
        </>
      )}

      {selectedComponent === 'coverage' && <ListCoverage />}
      {selectedComponent === 'speciality' && <ListSpeciality />}
    </div>
  );
}

export default InformacionAdicional;



