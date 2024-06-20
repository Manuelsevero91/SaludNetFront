// import React, { useState,useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import NavBar from "../Componentes/NavBar";



// const CreateSchedule = ({}) => {
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [currentDoctorLicense, setCurrentDoctorLicense] = useState("");
//   const [currentDoctorId, setCurrentDoctorId] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [interval, setInterval] = useState("30");
//   const [available, setAvailable] = useState(true);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (currentDoctorLicense) {
//       fetchDoctorId();
//     }
//   }, [currentDoctorLicense]);

//   const fetchDoctorId = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/doctors?license=${currentDoctorLicense}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching doctor ID: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.length > 0) {
//         setCurrentDoctorId(data[0].id);
//         setError(null);
//       } else {
//         setCurrentDoctorId("");
//         setError("No se encontró ningún doctor con esa licencia.");
//       }
//     } catch (error) {
//       console.error("Error fetching doctor ID:", error);
//       setError("Error al buscar el doctor. Por favor, inténtelo de nuevo más tarde.");
//     }
//   };

//   const createSchedulesForDays = async () => {
//     const schedules = {
//       days: selectedDates.map((day) => new Date(day).toISOString().split("T")[0]),
//       idDoctor: currentDoctorId,
//       start_Time: startTime,
//       end_Time: endTime,
//       available: available,
//       interval: interval,
//     };
//     try {
//       const response = await fetch("http://localhost:3000/schedules", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(schedules),
//       });
//       if (response.ok) {
//         setSuccessMessage("¡Agenda creada exitosamente!");
//         setSelectedDates([]);
//         setCurrentDoctorLicense("");
//         setCurrentDoctorId("");
//         setStartTime("");
//         setEndTime("");
//         setInterval("30");
//         setAvailable(true);
//       } else {
//         console.error("Error creando turnos", response.statusText);
//         setError("Error al crear la agenda. Por favor, inténtelo de nuevo más tarde.");
//       }
//     } catch (error) {
//       console.error("Error creando turnos", error);
//       setError("Error al crear la agenda. Por favor, inténtelo de nuevo más tarde.");
//     }
//   };

//   const handleCreateSchedule = (event) => {
//     event.preventDefault();
//     createSchedulesForDays();
//   };

//   const handleDoctorLicenseChange = (event) => {
//     setCurrentDoctorLicense(event.target.value);
//   };

//   const handleDatesChange = (date) => {
//     const dateString = date.toISOString().split("T")[0];
//     if (selectedDates.find((d) => d.toISOString().split("T")[0] === dateString)) {
//       setSelectedDates(selectedDates.filter((d) => d.toISOString().split("T")[0] !== dateString));
//     } else {
//       setSelectedDates([...selectedDates, date]);
//     }
//   };

//   const handleStartTimeChange = (event) => {
//     setStartTime(event.target.value);
//   };

//   const handleEndTimeChange = (event) => {
//     setEndTime(event.target.value);
//   };

//   const handleIntervalChange = (event) => {
//     setInterval(event.target.value);
//   };

//   const handleAvailableChange = (event) => {
//     setAvailable(event.target.checked);
//   };

//   const isDateSelected = (date) => {
//     return selectedDates.find((d) => d.toISOString().split("T")[0] === date.toISOString().split("T")[0]);
//   };
//   return (
//     <>

//         <NavBar showLinks={true} />        
//         <div className="barra-superior">
//           <h2 className="titulo-section">Administrar agenda: Crear</h2>
//         </div>
      
//         <div className="formContainer">  
//         <form className="createForm-Schedule" onSubmit={handleCreateSchedule}>
//          <div className="inputContainerSchedule">
//           <div className="input-container">
//           <label htmlFor="doctorLicense">Licencia del Doctor:</label>
//           <input
//             type="text"
//             id="doctorLicense"
//             value={currentDoctorLicense}
//             onChange={handleDoctorLicenseChange}
//           />
//           </div>
//           <div className="input-container">
//             <label>Hora de Inicio:</label>
//             <input
//               type="time"
//               id="startTime"
//               name="startTime"
//               value={startTime}
//               onChange={handleStartTimeChange}
//             />
//           </div>
//           <div className="input-container">
//             <label>Hora de Fin:</label>
//             <input
//               type="time"
//               id="endTime"
//               name="endTime"
//               value={endTime}
//               onChange={handleEndTimeChange}
//             />
//           </div>
//           <div className="input-container">
//             <label>Intervalo (minutos):</label>
//             <input
//               type="number"
//               id="interval"
//               name="interval"
//               value={interval}
//               onChange={handleIntervalChange}
//             />
//           </div>
//           <div className="input-container">
//             <label>Disponible:</label>
//             <input
//               type="checkbox"
//               id="available"
//               name="available"
//               checked={available}
//               onChange={handleAvailableChange}
//             />
//           </div>
//           </div>

// <div className="calendar-container">
// <Calendar
//               tileClassName={({ date }) => (isDateSelected(date) ? 'selected' : '')}
//               onClickDay={handleDatesChange}
//               value={selectedDates}
//               minDate={new Date()}
//             />
//           </div>
//           {successMessage && <div className="success-message">{successMessage}</div>}
//         </form>
//         <div className="btnCreateSchedule">
//           <button className="btn" type="submit">
//             Crear Agenda
//           </button>
//           </div>
          
//       </div>
    
//     </>
//   );
// };

// export default CreateSchedule;

// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import NavBar from "../Componentes/NavBar";
// const CreateSchedule = () => {
//   const [selectedDates, setSelectedDates] = useState([]); 
//   const [currentDoctorId, setCurrentDoctorId] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [interval, setInterval] = useState("30");
//   const [available, setAvailable] = useState(true);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [error, setError] = useState(null);
 
//   const createSchedulesForDays = async () => {
//     const schedules = {
//       days: selectedDates.map((day) => new Date(day).toISOString().split("T")[0]),
//       idDoctor: currentDoctorId,
//       start_Time: startTime,
//       end_Time: endTime,
//       available: available,
//       interval: interval,
//     };
//     try {
//       const response = await fetch("http://localhost:3000/schedules", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(schedules),
//       });
//       if (response.ok) {
//         setSuccessMessage("¡Agenda creada exitosamente!");
//         setSelectedDates([]);
//         setCurrentDoctorLicense("");
//         setCurrentDoctorId("");
//         setStartTime("");
//         setEndTime("");
//         setInterval("30");
//         setAvailable(true);
//       } else {
//         console.error("Error creando turnos", response.statusText);
//         setError("Error al crear la agenda. Por favor, inténtelo de nuevo más tarde.");
//       }
//     } catch (error) {
//       console.error("Error creando turnos", error);
//       setError("Error al crear la agenda. Por favor, inténtelo de nuevo más tarde.");
//     }
//   };
//   const handleCreateSchedule = (event) => {
//     event.preventDefault();
//     createSchedulesForDays();
//   };
//   const handleDoctorLicenseChange = (event) => {
//     setCurrentDoctorLicense(event.target.value);
//   };
//   const handleDatesChange = (date) => {
//     const dateString = date.toISOString().split("T")[0];
//     if (selectedDates.find((d) => d.toISOString().split("T")[0] === dateString)) {
//       setSelectedDates(selectedDates.filter((d) => d.toISOString().split("T")[0] !== dateString));
//     } else {
//       setSelectedDates([...selectedDates, date]);
//     }
//   };
//   const handleStartTimeChange = (event) => {
//     setStartTime(event.target.value);
//   };
//   const handleEndTimeChange = (event) => {
//     setEndTime(event.target.value);
//   };
//   const handleIntervalChange = (event) => {
//     setInterval(event.target.value);
//   };
//   const handleAvailableChange = (event) => {
//     setAvailable(event.target.checked);
//   };
//   const isDateSelected = (date) => {
//     return selectedDates.find((d) => d.toISOString().split("T")[0] === date.toISOString().split("T")[0]);
//   };
//   return (
//     <>
//       <NavBar showLinks={true} />
//       <div className="barra-superior">
//         <h2 className="titulo-section">Administrar agenda: Crear</h2>
//       </div>
//       <div className="formContainer">
//         <form className="createForm-Schedule" onSubmit={handleCreateSchedule}>
//           <div className="inputContainerSchedule">
//             <div className="input-container">
//               <label htmlFor="doctorLicense">Licencia del Doctor:</label>
//               <input
//                 type="text"
//                 id="doctorLicense"
//                 value={currentDoctorLicense}
//                 onChange={handleDoctorLicenseChange}
//               />
//             </div>
//             <div className="input-container">
//               <label>Hora de Inicio:</label>
//               <input
//                 type="time"
//                 id="startTime"
//                 name="startTime"
//                 value={startTime}
//                 onChange={handleStartTimeChange}
//               />
//             </div>
//             <div className="input-container">
//               <label>Hora de Fin:</label>
//               <input
//                 type="time"
//                 id="endTime"
//                 name="endTime"
//                 value={endTime}
//                 onChange={handleEndTimeChange}
//               />
//             </div>
//             <div className="input-container">
//               <label>Intervalo (minutos):</label>
//               <input
//                 type="number"
//                 id="interval"
//                 name="interval"
//                 value={interval}
//                 onChange={handleIntervalChange}
//               />
//             </div>
//             <div className="input-container">
//               <label>Disponible:</label>
//               <input
//                 type="checkbox"
//                 id="available"
//                 name="available"
//                 checked={available}
//                 onChange={handleAvailableChange}
//               />
//             </div>
//           </div>
//           <div className="calendar-container">
//             <Calendar
//               tileClassName={({ date }) => (isDateSelected(date) ? 'selected' : '')}
//               onClickDay={handleDatesChange}
//               value={selectedDates}
//               minDate={new Date()}
//             />
//           </div>
//           {successMessage && <div className="success-message">{successMessage}</div>}
//           {error && <div className="error-message">{error}</div>}
//           <div className="btnCreateSchedule">
//             <button className="btn" type="submit">
//               Crear Agenda
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };
// export default CreateSchedule;
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavBar from "../Componentes/NavBar";

const CreateSchedule = ({ doctorId }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDoctorId, setCurrentDoctorId] = useState(doctorId || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState('30');
  const [available, setAvailable] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const createScheduleForDay = async (schedule) => {
    try {
      const response = await fetch('http://localhost:3000/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule),
      });
      if (response.ok) {
        console.log('Turno creado', response);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error creando turno', error);
      throw error; // Propagar el error para manejarlo más arriba si es necesario
    }
  };

  const createSchedulesForDays = async () => {
    try {
      const schedules = selectedDates.map(day => ({
        days: [day.toISOString().split('T')[0]], // Convertir a formato ISO 8601
        idDoctor: currentDoctorId,
        start_Time: startTime,
        end_Time: endTime,
        available: available,
        interval: interval
      }));

      console.log('Schedules a crear:', schedules);

      await Promise.all(schedules.map(schedule => createScheduleForDay(schedule)));
      setSuccessMessage('¡Agenda creada exitosamente!');
      setSelectedDates([]);
      setStartTime('');
      setEndTime('');
      setInterval('30');
      setAvailable(true);
    } catch (error) {
      console.error('Error creando turnos', error);
      setErrorMessage('Hubo un error creando la agenda. Por favor, inténtelo de nuevo.');
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
    console.log('Fechas seleccionadas:', dates);
    setSelectedDates(dates); // dates debe ser un array de objetos Date
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
                onChange={handleDatesChange}
                value={selectedDates}
                selectRange={true}
                tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6}
              />
            </label>
            </div>
            </form>
            <button className='btnCreateSchedule'  type="submit">Crear Agenda</button>
            {successMessage && <p>{successMessage}</p>}
            {errorMessage && <p>{errorMessage}</p>}
          
       
      </div>
    </>
  );
};

export default CreateSchedule;
