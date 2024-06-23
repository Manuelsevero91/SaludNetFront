import React, { useEffect, useState } from "react";
import NavBar from "../Componentes/NavBar";

const Turnos = () => {
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
          throw new Error(`No se puede mostrar la lista de doctores: ${response.status}`);
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
      setSchedules(result.data || []);
      setLoadingSchedules(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
      setLoadingSchedules(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    fetchSchedule(doctor.id);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality.name
      .toLowerCase()
      .includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });

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
            <ul>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <li key={schedule.idSchedule}>
                    {schedule.day} - {schedule.start_Time} a {schedule.end_Time}
                  </li>
                ))
              ) : (
                <p>No hay turnos disponibles</p>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Turnos;
