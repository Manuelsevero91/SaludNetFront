// import React, { useEffect, useState } from "react";
// import NavBar from "../Componentes/NavBar";

// const Turnos = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [schedules, setSchedules] = useState([]);
//   const [loadingSchedules, setLoadingSchedules] = useState(false);
//   const [specialities, setSpecialities] = useState([]);
//   const [searchName, setSearchName] = useState("");
//   const [searchSpeciality, setSearchSpeciality] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [formData, setFormData] = useState({ fullname: "", phone: "" });

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/doctors");
//         if (!response.ok) {
//           throw new Error(
//             `No se puede mostrar la lista de doctores: ${response.status}`
//           );
//         }
//         const result = await response.json();
//         setDoctors(result.data);
//         setLoadingDoctors(false);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setLoadingDoctors(false);
//       }
//     };

//     const fetchSpecialities = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/speciality");
//         if (!response.ok) {
//           throw new Error(`Error fetching specialities: ${response.status}`);
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

//   const fetchSchedule = async (doctorId) => {
//     try {
//       setLoadingSchedules(true);
//       const response = await fetch(
//         `http://localhost:3000/schedules/by-doctor/${doctorId}`
//       );
//       if (!response.ok) {
//         throw new Error(`Error fetching schedules: ${response.status}`);
//       }
//       const result = await response.json();

//       setSchedules(result.data || []);

//       setLoadingSchedules(false);
//     } catch (error) {
//       console.error("Error fetching schedules:", error);
//       setSchedules([]);
//       setLoadingSchedules(false);
//     }
//   };

//   const handleDoctorSelect = (doctor) => {
//     setSelectedDoctor(doctor);
//     fetchSchedule(doctor.id);
//   };

//   const handleSelectSchedule = (schedule) => {
//     setSelectedSchedule(schedule);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a una API
//     console.log('Formulario enviado:', formData);
//     // Restablecer formulario y selección
//     setFormData({ fullname: '', phone: '' });
//     setSelectedSchedule(null);
//   };

//   const filteredDoctors = doctors.filter((doctor) => {
//     const fullNameMatch = doctor.fullName
//       .toLowerCase()
//       .includes(searchName.toLowerCase());
//     const specialityMatch = doctor.speciality.name
//       .toLowerCase()
//       .includes(searchSpeciality.toLowerCase());
//     return fullNameMatch && specialityMatch;
//   });

//   return (
//     <>
//       <NavBar showLinks={false} />
//       <div className="barra-superior">
//         <h2 className="titulo-section">Seleccionar turnos disponibles</h2>
//       </div>
//       <div className="search-bar">
//         <label className="search" htmlFor="searchName">
//           Nombre:
//         </label>
//         <input
//           type="text"
//           id="searchName"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//         <label className="search" htmlFor="searchSpeciality">
//           Especialidad:
//         </label>
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
//       <div className="tableContainer">
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
//             {loadingDoctors ? (
//               <tr>
//                 <td colSpan="4">Cargando doctores...</td>
//               </tr>
//             ) : (
//               filteredDoctors.map((doctor) => (
//                 <tr
//                   key={doctor.id}
//                   className={doctor.deleted ? "deleted-doctor" : ""}
//                 >
//                   <td>{doctor.fullName}</td>
//                   <td>{doctor.speciality.name}</td>
//                   <td>{doctor.license}</td>
//                   <td>
//                     {!doctor.deleted && (
//                       <button
//                         className="btn"
//                         onClick={() => handleDoctorSelect(doctor)}
//                       >
//                         Turnos disponibles
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       {selectedDoctor && (
//         <div className="scheduleList">
//           <h3>Turnos disponibles para {selectedDoctor.fullName}</h3>
//           {loadingSchedules ? (
//             <p>Cargando turnos...</p>
//           ) : (
//             <div className="shiffSelected">
//               <ul>
//                 {schedules.length > 0 ? (
//                   schedules.map((schedule) => (
//                     <li key={schedule.idSchedule}>
//                       {schedule.day} - {schedule.start_Time}
//                       <button
//                         className="btn"
//                         onClick={() => handleSelectSchedule(schedule)}
//                       >
//                         Seleccionar
//                       </button>
//                     </li>
//                   ))
//                 ) : (
//                   <p>No hay turnos disponibles</p>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//       {selectedSchedule && (
//         <div className="form-container">
//           <h3>
//             Formulario de contacto para el turno: {selectedSchedule.day} - {selectedSchedule.start_Time}
//           </h3>
//           <form onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="fullname">Nombre Completo:</label>
//               <input
//                 type="text"
//                 id="fullname"
//                 name="fullname"
//                 value={formData.fullname}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="phone">Teléfono:</label>
//               <input
//                 type="text"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button type="submit">Enviar</button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default Turnos;
import React, { useState, useEffect } from 'react';
import Spinner from '../Componentes/Spinner';
import Swal from 'sweetalert2';
import NavBar from '../Componentes/NavBar';


const ShiffSelection = () => {
  const [patientData, setPatientData] = useState({
    fullName: '',
    dni: '',
    mail: '',
    phone: '',
    address: '',
    birthday: '',
  });

  const [doctorId, setDoctorId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/doctors");
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.status}`);
        }
        const result = await response.json();
        setDoctors(result.data);
        setTimeout(() => {
          setLoadingDoctors(false);
        }, 2000);
      } catch (error) {
        setLoadingDoctors(false);
      } 
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (doctorId) {
        try {
          const response = await fetch(`http://localhost:3000/schedules/by-doctor/${doctorId}`);
          if (!response.ok) {
            throw new Error(`Error fetching schedules: ${response.status}`);
          }
          const data = await response.json();
          setSchedules(data.data); 
        } catch (error) {
          setSchedules([]); 
        }
      } else {
        setSchedules([]); 
      }
    };
    fetchSchedules();
  }, [doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value,
    });
  };

  const handleDoctorChange = (e) => {
    setDoctorId(e.target.value);
  };

  const handleScheduleChange = (e) => {
    setScheduleId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    
      const patientResponse = await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!patientResponse.ok) {
        throw new Error('Error creating patient');
      }

      const patientResult = await patientResponse.json();
      const patientId = patientResult.data.id;


      const shiffResponse = await fetch('http://localhost:3000/shiff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idSchedule: scheduleId,
          idPatient: patientId,
        }),
      });

      if (!shiffResponse.ok) {
        throw new Error('Error taking shiff');
      }
Swal.fire({text:"Turno reservado con éxito",icon:"success"})
    } catch (error) {

      Swal.fire({text:'Hubo un error al reservar el turno',icon:"error"})
    }
  };



  return (
    <>
<NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Reserva de turnos</h2>
      </div>



    <Spinner loading={loadingDoctors} />

    <div className="formContainer">      
    <form className='createForm' onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        value={patientData.fullName}
        onChange={handleInputChange}
        placeholder="NOMBRE Y Apellido"
        required
      />
      <input
        type="text"
        name="dni"
        value={patientData.dni}
        onChange={handleInputChange}
        placeholder="DNI"
        required
      />
      <input
        type="email"
        name="mail"
        value={patientData.mail}
        onChange={handleInputChange}
        placeholder="MAIL"
        required
      />
       <input
        type="text"
        name="phone"
        value={patientData.phone}
        onChange={handleInputChange}
        placeholder="CELULAR"
        required
      />
      <input
        type="text"
        name="address"
        value={patientData.address}
        onChange={handleInputChange}
        placeholder="DOMICILIO"
        required
      />
      <input
        type="text"
        name="birthday"
        value={patientData.birthday}
        onChange={handleInputChange}
        placeholder="FECHA DE NACIMIENTO: AAAA-MM-DD"
        required
      />
      <select onChange={handleDoctorChange} required>
        <option value="">Seleccione un doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.fullName} - {doctor.speciality.name}
          </option>
        ))}
      </select>

      <select onChange={handleScheduleChange} required>
        <option value="">Seleccione un horario</option>
        {schedules.map((schedule) => (
          <option key={schedule.idSchedule} value={schedule.idSchedule}>
            {schedule.day} - {schedule.start_Time} 
          </option>
        ))}
      </select>

      <button className="btn" type="submit">Reservar Turno</button>
    </form>
    </div>
    </>
  );
};

export default ShiffSelection;