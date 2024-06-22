// import React, { useEffect, useState } from "react";
// import NavBar from '../Componentes/NavBar';

// const Turnos = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [specialities, setSpecialities] = useState([]);
//   const [searchName, setSearchName] = useState("");
//   const [searchSpeciality, setSearchSpeciality] = useState("");

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const listDoctors = await fetch("http://localhost:3000/doctors");
//         const result = await listDoctors.json();
//         setDoctors(result.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setLoading(false);
//       }
//     };

//     const fetchSpecialities = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/speciality");
//         if (!response.ok) {
//           throw new Error(`Error al obtener las especialidades: ${response.status}`);
//         }
//         const responseData = await response.json();
//         setSpecialities(responseData.data);
//       } catch (error) {
//         console.error("Error fetching specialities:", error);
//       }
//     };

//     fetchDoctors();
//     fetchSpecialities();
//   }, []);

//   const filteredDoctors = doctors.filter((doctor) => {
//     const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
//     const specialityMatch = doctor.speciality.name.toLowerCase().includes(searchSpeciality.toLowerCase());
//     return fullNameMatch && specialityMatch;
//   });
 

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <NavBar showLinks={false} />
//       <div className="barra-superior">
//         <h2 className="titulo-section">Reserva de turnos</h2>
//       </div>
//       <div className="search-bar">
//         <label htmlFor="searchName">Nombre:</label>
//         <input
//           type="text"
//           id="searchName"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//         <label htmlFor="searchSpeciality">Especialidad:</label>
//         <select
//           id="searchSpeciality"
//           value={searchSpeciality}
//           onChange={(e) => setSearchSpeciality(e.target.value)}
//         >
//           <option value="">Todas</option>
//           {specialities.map((speciality) => (
//             <option key={speciality.id} value={speciality.name}>
//               {speciality.name}
//             </option>
//           ))}
//         </select>
//       </div>
//        <div className="turnosContainer">    
           
//         <table>
//           <thead>
//             <tr>
//               <th>Nombre</th>              
//               <th>Especialidad</th>
//               <th>Licencia</th>
//               <th>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDoctors.map((doctor) => (
//               <tr
//                 key={doctor.id}
//                 className={doctor.deleted ? "deleted-doctor" : ""}
//               >
//                 <td>{doctor.fullName}</td>                
//                 <td>{doctor.speciality.name}</td>
//                 <td>{doctor.license}</td>
//                 <td>
//                   {!doctor.deleted && (
//                     <>
//                       <button
//                         className="btn"type="button" onClick={setDoctors}                   
//                       >
//                         Ver Turnos Disponibles
//                       </button>
                      
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//        </div>
//       </>   
      
//       );
// };
    
//     export default Turnos;import React, { useEffect, useState } from "react";
import NavBar from '../Componentes/NavBar';
import React, { useEffect, useState } from "react";
const Turnos = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialities, setSpecialities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const listDoctors = await fetch("http://localhost:3000/doctors");
        if (!listDoctors.ok) {
          throw new Error(`Error al obtener los doctores: ${listDoctors.status}`);
        }
        const result = await listDoctors.json();
        setDoctors(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await fetch("http://localhost:3000/speciality");
        if (!response.ok) {
          throw new Error(`Error al obtener las especialidades: ${response.status}`);
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

  const fetchSchedules = async (doctorId) => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const formattedStartDate = startOfMonth.toISOString().split('T')[0];
      const formattedEndDate = endOfMonth.toISOString().split('T')[0];

      const response = await fetch(`http://localhost:3000/schedules?doctorId=${doctorId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener los turnos: ${response.status}`);
      }
      
      const result = await response.json();
      setSchedules(result.data);
      setSelectedDoctor(doctorId);
      setError(null); // Limpiar errores si la solicitud fue exitosa
      
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError(error.message); // Capturar el error y mostrarlo en el UI
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality.name.toLowerCase().includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Reserva de turnos</h2>
      </div>
      <div className="search-bar">
        <label htmlFor="searchName">Nombre:</label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label htmlFor="searchSpeciality">Especialidad:</label>
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
      <div className="turnosContainer">
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
            {filteredDoctors.map((doctor) => (
              <tr
                key={doctor.id}
                className={doctor.deleted ? "deleted-doctor" : ""}
              >
                <td>{doctor.fullName}</td>
                <td>{doctor.speciality.name}</td>
                <td>{doctor.license}</td>
                <td>
                  {!doctor.deleted && (
                    <>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => fetchSchedules(doctor.id)}
                      >
                        Ver Turnos Disponibles
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div>Error: {error}</div>} {/* Mostrar error si hay algún problema */}
        {selectedDoctor && (
          <div className="schedules-list">
            <h3>Turnos Disponibles para {doctors.find(doc => doc.id === selectedDoctor).fullName}</h3>
            <ul>
              {schedules.map((schedule) => (
                <li key={schedule.id}>
                  Fecha: {schedule.date}, Hora: {schedule.time}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Turnos;

