import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NavBar from "./NavBar";
import Swal from 'sweetalert2';
import { getToken } from "../Auth/tokenUtils";

const DeleteSchedule = () => {
  const [currentDoctorId, setCurrentDoctorId] = useState("");
  const [deletionReason, setDeletionReason] = useState("error administrativo");
  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDoctorIdChange = (e) => setCurrentDoctorId(e.target.value);
  const handleReasonChange = (e) => setDeletionReason(e.target.value);

  const handleDatesChange = (date) => {
    const newDate = date.toDateString();
    setSelectedDates((prevDates) =>
      prevDates.includes(newDate)
        ? prevDates.filter((d) => d !== newDate)
        : [...prevDates, newDate]
    );
  };

  const handleDeleteSchedule = async (e) => {
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

    const requests = selectedDates.map(async (date) => {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const endpoint = `http://localhost:3000/schedules/${currentDoctorId}/${formattedDate}`;

      try {
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ deletionReason }),
        });

        if (response.ok) {
          return response;
        } else {
          throw new Error('Error al eliminar el horario');
        }
      } catch (error) {
        throw new Error('Error de red al eliminar el horario');
      }
    });

    try {
      const responses = await Promise.all(requests);
      const successfulResponses = responses.filter((res) => res.status === 200);
      if (successfulResponses.length > 0) {
        setSuccess(`Se han eliminado ${successfulResponses.length} horarios exitosamente`);
        Swal.fire({
          icon: 'success',
          html: '<span>Se eliminó la agenda con éxito</span>',
          text: `Se han eliminado ${successfulResponses.length} horarios exitosamente`,
        });
      } else {
        setError("No se pudo eliminar ningún horario");
        Swal.fire({
          icon: 'error',
          html: '<span>Error</span>',
          text: "No se pudo eliminar ningún horario. Verifique estar logueado.",
        });
      }
    } catch (err) {
      setError("Hubo un error al eliminar los horarios");
      Swal.fire({
        icon: 'error',
        html: '<span>Error</span>',
        text: "Hubo un error al eliminar los horarios. Verifique estar logueado.",
      });
    }
  };

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar agenda: Eliminar</h2>
      </div>
      <div className="formContainer">
        <form className="createDeleteForm" onSubmit={handleDeleteSchedule}>
          <div className="inputContainerSchedule">
            <div className="input-container">
              <input
                className="inputSchedule"
                type="text"
                value={currentDoctorId}
                onChange={handleDoctorIdChange}
                placeholder="Matrícula"
              />
              <label>Razón de eliminación:</label>
              <select value={deletionReason} onChange={handleReasonChange}>
                <option value="error administrativo">Error administrativo</option>
                <option value="cancelación del doctor">Cancelación del doctor</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <label>
              <Calendar
                onClickDay={handleDatesChange}
                tileDisabled={({ date }) => date < new Date()}
                tileClassName={({ date }) =>
                  selectedDates.includes(date.toDateString()) ? "selected" : null
                }
              />
            </label>
          </div>
          <button className="btnCreateDelete" type="submit">
            Eliminar Agenda
          </button>
        </form>
      </div>
    </>
  );
};

export default DeleteSchedule;
