import React, { useEffect, useState } from "react";
import NavBar from "../Componentes/NavBar";

const ShiffSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/doctors");
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.status}`);
        }
        const result = await response.json();
        setDoctors(result.data);
        setLoadingDoctors(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoadingDoctors(false);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await fetch("http://localhost:3000/speciality");
        if (!response.ok) {
          throw new Error(`Error fetching specialities: ${response.status}`);
        }
        const responseData = await response.json();
        setSpecialities(responseData.data);
      } catch (error) {
        console.error("Error fetching specialities:", error);
      }
    };

    fetchDoctors();
    fetchSpecialities();
  }, []);

  const fetchSchedule = async (doctorId) => {
    try {
      setLoadingSchedules(true);
      const response = await fetch(`http://localhost:3000/schedules/by-doctor/${doctorId}`);
      if (!response.ok) {
        throw new Error(`Error fetching schedules: ${response.status}`);
      }
      const result = await response.json();

      // Filtrar agendas solo para días futuros y ordenar por día y hora de inicio
      const currentDate = new Date();
      const filteredSchedules = result.data.filter(schedule => {
        const scheduleDate = new Date(schedule.day);
        return scheduleDate >= currentDate;
      }).sort((a, b) => {
        if (a.day !== b.day) {
          return new Date(a.day) - new Date(b.day); // Ordenar por fecha
        }
        return a.start_Time.localeCompare(b.start_Time); // Si el día es el mismo, ordenar por hora de inicio
      });
      
      setSchedules(filteredSchedules);
      setLoadingSchedules(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setLoadingSchedules(false);
      setSchedules([]); // Limpiar las agendas en caso de error
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    fetchSchedule(doctor.id);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality.name.toLowerCase().includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });

  const renderScheduleTables = () => {
    if (!selectedDoctor || loadingSchedules) {
      return null;
    }

    // Agrupar los horarios por día
    const groupedSchedules = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.day]) {
        acc[schedule.day] = [];
      }
      acc[schedule.day].push(schedule);
      return acc;
    }, {});

    // Ordenar horarios dentro de cada día por hora de inicio
    Object.keys(groupedSchedules).forEach((day) => {
      groupedSchedules[day].sort((a, b) => a.start_Time.localeCompare(b.start_Time));
    });

    return Object.entries(groupedSchedules).map(([day, schedulesOfDay]) => (
      <div key={day} className="schedule-table">
        <h4>{formatDayTitle(day)}</h4>
        <ul>
          {schedulesOfDay.map((schedule) => (
            <li key={schedule.idSchedule}>
              {formatTime(schedule.start_Time)} - <button onClick={() => handleTakeAppointment(schedule)}>Tomar turno</button>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  const formatDayTitle = (day) => {
    // Convertir la fecha a un formato más legible
    const date = new Date(day);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-AR', options); // Formato español para Argentina
  };

  const formatTime = (time) => {
    // Formatear la hora si es necesario
    return time; // Por ahora, simplemente devolvemos la hora
  };

  const handleTakeAppointment = (schedule) => {
    // Aquí puedes implementar la lógica para reservar el turno
    console.log(`Se reservó el turno para el día ${formatDayTitle(schedule.day)} a las ${formatTime(schedule.start_Time)}.`);
  };

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">
          Seleccionar turnos disponibles
        </h2>
      </div>
      <div className="search-bar">
        <label className="search" htmlFor="searchName">
          Nombre:
        </label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label className="search" htmlFor="searchSpeciality">
          Especialidad:
        </label>
        <select
          id="searchSpeciality"
          value={searchSpeciality}
          onChange={(e) => setSearchSpeciality(e.target.value)}
        >
          <option value="">Todas</option>
          {specialities.map((speciality) => (
            <option key={speciality.id} value={speciality.name}>
              {speciality.name}
            </option>
          ))}
        </select>
      </div>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Licencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loadingDoctors ? (
              <tr>
                <td colSpan="4">Cargando doctores...</td>
              </tr>
            ) : (
              filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className={doctor.deleted ? "deleted-doctor" : ""}
                >
                  <td>{doctor.fullName}</td>
                  <td>{doctor.speciality.name}</td>
                  <td>{doctor.license}</td>
                  <td>
                    {!doctor.deleted && (
                      <button
                        className="turnos-disponibles"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        Turnos disponibles
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedDoctor && (
        <div className="scheduleList">
          <h3>Turnos disponibles para {selectedDoctor.fullName}</h3>
          {loadingSchedules ? (
            <p>Cargando turnos...</p>
          ) : (
            <div>
              {schedules.length > 0 ? (
                renderScheduleTables()
              ) : (
                <p>No hay turnos disponibles</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShiffSelection;
















