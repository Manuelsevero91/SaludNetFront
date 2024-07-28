import React, { useState, useEffect } from "react";
import Spinner from "../Componentes/Spinner";
import Swal from "sweetalert2";
import NavBar from "../Componentes/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../Auth/tokenUtils";

const EditShiffs = () => {
  const [shiffs, setShiffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
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
        const [shiffRes, patientRes, doctorRes] = await Promise.all([
          fetch("http://localhost:3000/shiff", {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }),
          fetch("http://localhost:3000/patients", {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }),
          fetch("http://localhost:3000/doctors", {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }),
        ]);
        const [shiffData, patientData, doctorData] = await Promise.all([
          shiffRes.json(),
          patientRes.json(),
          doctorRes.json(),
        ]);
        const combinedData = shiffData.data.map((shiff) => {
          const patient = patientData.data.find(
            (p) => p.id === shiff.Patient.id
          );
          const doctor = doctorData.data.find(
            (d) => d.id === shiff.Schedules.idDoctor
          );
          return {
            ...shiff,
            patient: patient,
            doctor: doctor,
          };
        });
        setShiffs(combinedData);
        setDoctors(doctorData.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire({
          text: "No se pudo traer la lista de turnos. Verifique estar logueado.",
          icon: "warning",
        });
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
    const result = await Swal.fire({
      html: "<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/shiff/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error(`Error Deleting shiff: ${response.status}`);
        } else {
          await response.json();
          setShiffs((prevShiff) =>
            prevShiff.filter((shiff) => shiff.id !== id)
          );
          Swal.fire({
            icon: 'success',
            html: '<span>Se ha eliminado el turno con éxito</span>',
            
          })
        }
      } catch {
        Swal.fire(
          "Error!",
          "Hubo un error al intentar eliminar el turno. Verifique estar logueado.",
          "error"
        );
      }
    }
  };
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires'
    };
    const date = new Date(dateString);
    const dateInBA = new Date(date.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(dateInBA);
    const day = dateInBA.getDate();
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(dateInBA);
    const year = dateInBA.getFullYear();
    return `${dayName} ${day} de ${monthName} de ${year}`;
  };
  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedDay('');
  };
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  const filteredShiffs = shiffs
    .filter((shiff) => {
      if (selectedDoctor && selectedDoctor !== '' && shiff.Schedules.fullName !== selectedDoctor) {
        return false;
      }
      if (selectedDay && selectedDay !== '' && new Date(shiff.Schedules.day).toISOString().slice(0, 10) !== selectedDay) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(a.Schedules.day) - new Date(b.Schedules.day));  // Ordenar por fecha
  return (
    <>
      <Spinner loading={loading} />
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Eliminar turnos</h2>
      </div>
      <div>
        {!loading && (
          <div>
            <div className="search-bar">
              <label className="search" htmlFor="selectDoctor">Doctor:</label>
              <select
                id="selectDoctor"
                value={selectedDoctor}
                onChange={handleDoctorChange}
              >
                <option value="">Todos</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.fullName}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
              <label className="search" htmlFor="selectDay">Día:</label>
              <input
                type="date"
                id="selectDay"
                value={selectedDay}
                onChange={handleDayChange}
              />
            </div>
            <div className="tableContainer">
              <table className="Table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Paciente</th>
                    <th>Telefono Paciente</th>
                    <th>Fecha Turno</th>
                    <th>Horario Turno</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShiffs.map((shiff) => (
                    <tr key={shiff.id}>
                      <td>{shiff.Schedules.fullName || "N/A"}</td>
                      <td>{shiff.patient.fullName}</td>
                      <td>{shiff.patient.phone}</td>
                      <td>{formatDate(shiff.Schedules.day)}</td>
                      <td>{shiff.Schedules.start_Time}</td>
                      <td>
                        <button className="delete-button" onClick={() => handleDelete(shiff.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default EditShiffs;

