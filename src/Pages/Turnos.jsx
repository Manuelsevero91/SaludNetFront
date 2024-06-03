import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';

const Turnos = () => {
  const [doctores, setDoctores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/doctors')
      .then(res => res.json())
      .then(data => setDoctores(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (filtro.length > 0 && doctores.length > 0) {
      const resultadosFiltrados = doctores.filter(doctor =>
        doctor.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        doctor.especialidad.toLowerCase().includes(filtro.toLowerCase())
      ).map(doctor => ({
        value: doctor.id,
        label: `${doctor.nombre} - ${doctor.especialidad}`
      }));
      setResultados(resultadosFiltrados);
    } else {
      setResultados([]);
    }
  }, [filtro, doctores]);

  const handleInputChange = (inputValue) => {
    setFiltro(inputValue);
  };

  const handleSeleccionarDoctor = (selectedOption) => {
    setSeleccionado(selectedOption ? selectedOption.value : null);
  };

  const handleFechaChange = (date) => {
    setFecha(date);
    const horariosDisponibles = disponibilidad.find(d => new Date(d.fecha).toDateString() === date.toDateString())?.horarios || [];
    setHorarios(horariosDisponibles);
  };

  return (
    <div className="formContainer">
      <div className="createForm">
        <div className="input-container">
          <Select
            value={resultados.find(option => option.value === seleccionado)}
            onChange={handleSeleccionarDoctor}
            options={resultados}
            placeholder="Buscar médico por nombre o especialidad"
            onInputChange={handleInputChange}
            isClearable
          />
        </div>

        {seleccionado && (
          <div className="calendar-container">
            <h2>{doctores.find(d => d.id === seleccionado).nombre}</h2>
            <Calendar
              className="custom-calendar"
              onChange={handleFechaChange}
              value={fecha}
            />
            {horarios.length > 0 ? (
              <ul className="schedule-list">
                {horarios.map((horario, index) => (
                  <li key={index}>{horario}</li>
                ))}
              </ul>
            ) : (
              <p>No hay horarios disponibles para esta fecha.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Turnos;
