import React, { useState, useEffect } from 'react';
import Spinner from '../Componentes/Spinner';
import Swal from 'sweetalert2';
import NavBar from '../Componentes/NavBar';

const ShowShiffs = () => {
  const [shiffs, setShiffs] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    const fetchShiffs = async () => {
      try {
        const response = await fetch('http://localhost:3000/shiff');
        if (!response.ok) {
          throw new Error(`Error fetching shiffs: ${response.status}`);
        }
        const result = await response.json();
        // Ordenar los turnos por día
        const sortedShiffs = result.data.sort((a, b) => new Date(a.Schedules.day) - new Date(b.Schedules.day));
        setShiffs(sortedShiffs);
      
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire({ text: 'Hubo un error al traer los turnos', icon: 'error' });
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/doctors');
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.status}`);
        }
        const result = await response.json();
        setDoctors(result.data);
      } catch (error) {
        Swal.fire({ text: 'Hubo un error al traer los doctores', icon: 'error' });
      }
    };

    fetchShiffs();
    fetchDoctors();
  }, []);
 

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

//Como lo quiero ver
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

  const filteredShiffs = shiffs.filter((shiff) => {
    if (selectedDoctor && selectedDoctor !== '' && shiff.Schedules.fullName !== selectedDoctor) {
      return false;
    }
    if (selectedDay && selectedDay !== '' && new Date(shiff.Schedules.day).toISOString().slice(0, 10) !== selectedDay) {
      return false;
    }
  
    return true;
   
  });

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Lista de turnos reservados</h2>
      </div>

      <Spinner loading={loading} />

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

          {filteredShiffs.length > 0 ? 
            <div className="tableContainer">
              <table>
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Hora</th>
                    <th>Doctor</th>
                    <th>Paciente</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {filteredShiffs.map((shiff) => (
                    <tr key={shiff.id}>
                      <td>{formatDate(shiff.Schedules?.day) || 'N/A'}</td>
                      <td>{shiff.Schedules?.start_Time || 'N/A'}</td>
                      <td>{shiff.Schedules.fullName || 'N/A'}</td>
                      <td>{shiff.Patient?.fullName || 'N/A'}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           : (
            <p></p>
          )}
        </div>
      )}
    </>
  );
};

export default ShowShiffs;