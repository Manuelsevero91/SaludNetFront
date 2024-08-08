import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NavBar from "./NavBar";
import Swal from "sweetalert2";
import { getToken } from "../Auth/tokenUtils";

const CreateSchedule = () => {
  const [currentLicense, setCurrentLicense] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState(30);
  const [available, setAvailable] = useState(true);

  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLicenseChange = (e) => setCurrentLicense(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleIntervalChange = (e) => setInterval(e.target.value);

  const handleDatesChange = (date) => {
    const newDate = date.toDateString();
    setSelectedDates((prevDates) =>
      prevDates.includes(newDate)
        ? prevDates.filter((d) => d !== newDate)
        : [...prevDates, newDate]
    );
  };

  const getDoctorIdByLicense = async (license) => {
    const token = getToken();

  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
    try {

      const response = await fetch(`http://localhost:3000/doctors/license/${license}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Doctor no encontrado");
      }
      const doctor = await response.json();
      return doctor.id;
    } catch (error) {
      throw new Error("Error al buscar el doctor");
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");


    const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }

    // Verificar si las fechas seleccionadas son válidas

    const today = new Date().toDateString();
    if (selectedDates.some(date => new Date(date) < new Date(today))) {
      Swal.fire({
        icon: 'error',
        html: '<span>Error</span>',
        text: "No puedes seleccionar fechas anteriores a la fecha actual",
      });
      return;
    }
 

     

        try {
          const doctorId = await getDoctorIdByLicense(currentLicense);
          const requests = selectedDates.map(async (date) => {
            const scheduleData = {
              day: new Date(date).toISOString().split("T")[0],
              idDoctor: doctorId,
              start_Time: startTime,
              end_Time: endTime,
              available,
              interval: interval.toString(),
            };
            try {
              const response = await fetch('http://localhost:3000/schedules', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(scheduleData),
              });
    
              if (response.ok) {
                return response;
              } else {
                throw new Error('Error al crear el horario');
              };
            } catch (error) {
              throw new Error('Error de red al crear el horario');
            }
          });
    

      const responses = await Promise.all(requests);
      const successfulResponses = responses.filter((res) => res.status === 201);
      if (successfulResponses.length > 0) {
        Swal.fire({
          icon: "success",
          html: "<span>Se creó la agenda con éxito</span>",
          text: `Se han creado ${successfulResponses.length} horarios exitosamente`,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          html: "<span>Error</span>",
          text: "No se pudo crear ningún horario. Verifique estar logueado.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        html: "<span>Error</span>",
        text: "Hubo un error al crear los horarios. Verifique estar logueado.",
      });
    }
  };

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar agenda: Crear</h2>
      </div>
      <div className="formContainer">
        <form className="createDeleteForm" onSubmit={handleCreateSchedule}>
          <div className="inputContainerSchedule">
            <div className="input-container">
              <input
                className="inputSchedule"
                type="text"
                value={currentLicense}
                onChange={handleLicenseChange}

                placeholder="Número de Matrícula"


              />
              <label>Hora de Inicio:</label>
              <input
                className="inputSchedule"
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
              />
              <label>Hora de Finalización:</label>
              <input
                className="inputSchedule"
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
              />
              <label>Intervalo:</label>
              <input
                className="inputSchedule"
                type="number"
                value={interval}
                onChange={handleIntervalChange}
              />
            </div>
            <label>
              <Calendar
                onClickDay={handleDatesChange}
                tileDisabled={({ date }) => date < new Date()}
                tileClassName={({ date }) =>
                  selectedDates.includes(date.toDateString())
                    ? "selected"
                    : null
                }
              />
            </label>
          </div>
          <button className="btnCreateDelete" type="submit">
            Crear Agenda
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateSchedule;
