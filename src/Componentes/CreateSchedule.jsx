import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavBar from './NavBar';


const CreateSchedule = () => {
  const [currentDoctorId, setCurrentDoctorId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState(30);
  const [available, setAvailable] = useState(true);

  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDoctorIdChange = (e) => setCurrentDoctorId(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleIntervalChange = (e) => setInterval(e.target.value);
  const handleAvailableChange = (e) => setAvailable(e.target.checked);

  const handleDatesChange = (date) => {
    const newDate = date.toDateString();
    setSelectedDates((prevDates) =>
      prevDates.includes(newDate) ? prevDates.filter((d) => d !== newDate) : [...prevDates, newDate]
    );
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const requests = selectedDates.map(date => {
      const scheduleData = {
        day: new Date(date).toISOString().split('T')[0],
        idDoctor: currentDoctorId,
        start_Time: startTime,
        end_Time: endTime,
        available,
        interval: interval.toString()
      };

      console.log('Sending scheduleData:', scheduleData); // Log the data being sent

      return fetch('http://localhost:3000/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });
    });

    try {
      const responses = await Promise.all(requests);
      const successfulResponses = responses.filter(res => res.status === 201);
      if (successfulResponses.length > 0) {
        setSuccess(`Se han creado ${successfulResponses.length} horarios exitosamente`);
      } else {
        setError('No se pudo crear ningún horario');
      }
    } catch (err) {
      setError('Hubo un error al crear los horarios');
    }
  };


  const isDateSelected = (date) => {
    return selectedDates.find((d) => d.toISOString().split("T")[0] === date.toISOString().split("T")[0]);
  };


  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar agenda: Crear</h2>
      </div>
      <div className="formContainer">
        <form className="createForm-Schedule" onSubmit={handleCreateSchedule}>

          <div className="inputContainerSchedule">
            <div className="input-container">
              <label>
                Doctor ID:
                <input type="text" value={currentDoctorId} onChange={handleDoctorIdChange} />
              </label>
              <label>
                Hora de Inicio:
                <input type="time" value={startTime} onChange={handleStartTimeChange} />
              </label>
              <label>
                Hora de Fin:
                <input type="time" value={endTime} onChange={handleEndTimeChange} />
              </label>
              <label>
                Intervalo:
                <input type="number" value={interval} onChange={handleIntervalChange} />
              </label>
              <label>
                Disponible:
                <input type="checkbox" checked={available} onChange={handleAvailableChange} />
              </label>
            </div>
            <label>
              Fechas:
              <Calendar
                onClickDay={handleDatesChange}
                tileClassName={({ date }) => selectedDates.includes(date.toDateString()) ? 'selected' : null}
              />
            </label>
          </div>
          <button className='btnCreateSchedule' type="submit">Crear Agenda</button>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </>
  );
};



export default CreateSchedule;
