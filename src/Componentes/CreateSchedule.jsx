import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Styles/CreateSchedule.css';
import NavBar from '../Componentes/NavBar';



const CreateSchedule = ({ doctorId }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDoctorId, setCurrentDoctorId] = useState(doctorId || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState('30');
  const [available, setAvailable] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const createSchedulesForDays = async () => {
    const schedules = [];
    selectedDates.forEach(day => {
      const fecha = new Date(day);
      if (fecha.getDay() !== 0 && fecha.getDay() !== 4) { 
        schedules.push({
          day: fecha.toISOString().split('T')[0],
          idDoctor: currentDoctorId,
          start_Time: startTime,
          end_Time: endTime,
          available: available,
          interval: interval
        });
      }
    });

    try {
      const response = await fetch('http://localhost:3000/schedules/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedules),
      });
      console.log('Turnos creados', response);
      setSuccessMessage('¡Agenda creada exitosamente!');
      setSelectedDates([]); // Limpiar los días seleccionados después de enviar el formulario
    } catch (error) {
      console.error('Error creando turnos', error);
    }
  };
  

  const handleCreateSchedule = (event) => {
    event.preventDefault();
    createSchedulesForDays();
  };

  const handleDoctorIdChange = (event) => {
    setCurrentDoctorId(event.target.value);
  };

  const handleDatesChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const handleAvailableChange = (event) => {
    setAvailable(event.target.checked);
  };

  return (
    <>
    <div className="createSchedule-container">
      <NavBar showLinks={true}/>
      <div className="barra-superior-schedule">
        <h1 className="titulo-seccion">Administrar agenda: Crear</h1>
      </div>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="create-schedule-container">
      {/* <h2 className="create-schedule-title">Crear Agenda de Turnos</h2> */}
      <form className="create-schedule-form" onSubmit={handleCreateSchedule}>
        <div className="input-container">
          <label htmlFor="doctorId">ID del Doctor:</label>
          <input
            type="text"
            id="doctorId"
            name="doctorId"
            value={currentDoctorId}
            onChange={handleDoctorIdChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="startTime">Hora de Inicio:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={startTime}
            onChange={handleStartTimeChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="endTime">Hora de Fin:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={endTime}
            onChange={handleEndTimeChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="interval">Intervalo (minutos):</label>
          <input
            type="number"
            id="interval"
            name="interval"
            value={interval}
            onChange={handleIntervalChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="available">Disponible:</label>
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={available}
            onChange={handleAvailableChange}
          />
        </div>
        <button className="create-schedule-button" type="submit">Crear Agenda</button>
      </form>
      <div className="calendar-container">
        <Calendar
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const turno = selectedDates.find(d => new Date(d).toDateString() === date.toDateString());
              if (turno) {
                return <div>Selected</div>;
              }
            }
          }}
          selectRange={true}
          value={selectedDates}
          onChange={handleDatesChange}
          minDate={new Date()}
        />
      </div>
      
    </div>
    </div>
    </>
  );
};

export default CreateSchedule;
