// import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
// import "../Styles/ListProfesionals.css";
// import NavBar from "../Componentes/NavBar";



// const ShiftSelection = () => {
//   useEffect(() => {
//     Modal.setAppElement('#root'); // Puedes cambiar '#root' por el elemento que contiene tu aplicación
//   }, []);
//   const [doctors, setDoctors] = useState([]);
//   const [specialities, setSpecialities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [shifts, setShifts] = useState([]);
//   const [selectedShift, setSelectedShift] = useState(null);
//   const [patientInfo, setPatientInfo] = useState({
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//   });
//   const [reservationStatus, setReservationStatus] = useState({
//     loading: false,
//     error: null,
//     successMessage: null,
//   });
//   const [searchInput, setSearchInput] = useState("");
//   const [searchSpeciality, setSearchSpeciality] = useState("");

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/doctors");
//         if (!response.ok) {
//           throw new Error(`Error fetching doctors: ${response.status}`);
//         }
//         const data = await response.json();
//         setDoctors(data.data);
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
//           throw new Error(`Error fetching specialities: ${response.status}`);
//         }
//         const data = await response.json();
//         setSpecialities(data.data);
//       } catch (error) {
//         console.error("Error fetching specialities:", error);
//       }
//     };

//     fetchDoctors();
//     fetchSpecialities();
//   }, []);

//   const handleSearch = (e) => {
//     setSearchInput(e.target.value);
//   };

//   const handleSpecialitySearch = (e) => {
//     setSearchSpeciality(e.target.value);
//   };

//   const handleDoctorSelection = async (doctorId) => {
//     const doctor = doctors.find((doc) => doc.id === doctorId);
//     setSelectedDoctor(doctor);
//     await fetchShifts(doctorId);
//     setShowModal(true); // Mostrar el modal después de obtener los turnos
//   };

//   const fetchShifts = async (doctorId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/schedules?doctorId=${doctorId}`
//       );
//       if (!response.ok) {
//         throw new Error(`Error fetching shifts: ${response.status}`);
//       }
//       const data = await response.json();
//       setShifts(data.data);
//     } catch (error) {
//       console.error("Error fetching shifts:", error);
//     }
//   };

//   const handleReserveShift = async () => {
//     if (
//       !selectedShift ||
//       !patientInfo.firstName ||
//       !patientInfo.lastName ||
//       !patientInfo.phoneNumber
//     ) {
//       alert("Por favor complete todos los campos.");
//       return;
//     }

//     const reservation = {
//       doctorId: selectedDoctor.id,
//       shiftId: selectedShift.id,
//       firstName: patientInfo.firstName,
//       lastName: patientInfo.lastName,
//       phoneNumber: patientInfo.phoneNumber,
//     };

//     try {
//       setReservationStatus({
//         loading: true,
//         error: null,
//         successMessage: null,
//       });

//       const response = await fetch("http://localhost:3000/reservar-turno", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(reservation),
//       });

//       if (!response.ok) {
//         throw new Error(`Error al reservar turno: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Respuesta del backend:", data);

//       setReservationStatus({
//         loading: false,
//         error: null,
//         successMessage: `¡Turno reservado con éxito para el ${selectedShift.time}! Espere la confirmación vía WhatsApp.`,
//       });

//       closeModal();
//     } catch (error) {
//       console.error("Error al reservar turno:", error);
//       setReservationStatus({
//         loading: false,
//         error: "Error al reservar turno. Por favor intenta nuevamente.",
//         successMessage: null,
//       });
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedDoctor(null);
//     setShifts([]);
//     setSelectedShift(null);
//     setPatientInfo({
//       firstName: "",
//       lastName: "",
//       phoneNumber: "",
//     });
//     setReservationStatus({
//       loading: false,
//       error: null,
//       successMessage: null,
//     });
//   };

//   return (
//     <>
//       <NavBar showLinks={true} />
//       <div className="barra-superior">
//         <h2 className="titulo-section">Selección de Turno</h2>
//       </div>
//       <div className="list">
//         <div className="search-bar">
//           <label htmlFor="searchInput">Buscar por Nombre:</label>
//           <input
//             type="text"
//             id="searchInput"
//             value={searchInput}
//             onChange={handleSearch}
//           />
//           <label htmlFor="searchSpeciality">Buscar por Especialidad:</label>
//           <select
//             id="searchSpeciality"
//             value={searchSpeciality}
//             onChange={handleSpecialitySearch}
//           >
//             <option value="">Todas</option>
//             {specialities.map((speciality) => (
//               <option key={speciality.id} value={speciality.name}>
//                 {speciality.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         {loading ? (
//           <p>Cargando médicos...</p>
//         ) : (
//           <>
//             {doctors
//               .filter(
//                 (doctor) =>
//                   (searchInput === "" ||
//                     doctor.fullName
//                       .toLowerCase()
//                       .includes(searchInput.toLowerCase())) &&
//                   (searchSpeciality === "" ||
//                     doctor.speciality.name
//                       .toLowerCase()
//                       .includes(searchSpeciality.toLowerCase()))
//               )
//               .map((doctor) => (
//                 <div key={doctor.id}>
//                   <h3>{doctor.fullName}</h3>
//                   <p>Especialidad: {doctor.speciality.name}</p>
//                   <button onClick={() => handleDoctorSelection(doctor.id)}>
//                     Ver Turnos Disponibles
//                   </button>
//                 </div>
//               ))}
//           </>
//         )}
//         <Modal isOpen={showModal} onRequestClose={closeModal}>
//           {selectedDoctor && (
//             <>
//               <h2>Turnos Disponibles de {selectedDoctor.fullName}</h2>
//               {shifts.length > 0 ? (
//                 <ul>
//                   {shifts.map((shift) => (
//                     <li key={shift.id}>
//                       <input
//                         type="radio"
//                         id={`shift_${shift.id}`}
//                         name="selectedShift"
//                         value={shift.id}
//                         onChange={() => setSelectedShift(shift)}
//                         checked={
//                           selectedShift && selectedShift.id === shift.id
//                         }
//                       />
//                       <label htmlFor={`shift_${shift.id}`}>
//                         {shift.time}
//                       </label>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No hay turnos disponibles para {selectedDoctor.fullName}.</p>
//               )}
//               {selectedShift && (
//                 <form
//                   className="createForm-Profesionals"
//                   onSubmit={handleReserveShift}
//                 >
//                   <h2>Reserva de Turno</h2>
//                   <label htmlFor="firstName">Nombre:</label>
//                   <input
//                     type="text"
//                     id="firstName"
//                     name="firstName"
//                     value={patientInfo.firstName}
//                     onChange={(e) =>
//                       setPatientInfo({
//                         ...patientInfo,
//                         firstName: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                   <label htmlFor="lastName">Apellido:</label>
//                   <input
//                     type="text"
//                     id="lastName"
//                     name="lastName"
//                     value={patientInfo.lastName}
//                     onChange={(e) =>
//                       setPatientInfo({
//                         ...patientInfo,
//                         lastName: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                   <label htmlFor="phoneNumber">Teléfono:</label>
//                   <input
//                     type="tel"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     value={patientInfo.phoneNumber}
//                     onChange={(e) =>
//                       setPatientInfo({
//                         ...patientInfo,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                   <button className="Btn" type="submit">
//                     Reservar Turno
//                   </button>
//                   <button className="Btn" type="button" onClick={closeModal}>
//                     Cancelar
//                   </button>
//                 </form>
//               )}
//               {reservationStatus.successMessage && (
//                 <p className="success-message">
//                   {reservationStatus.successMessage}
//                 </p>
//               )}
//               {reservationStatus.error && (
//                 <p className="error-message">{reservationStatus.error}</p>
//               )}
//             </>
//           )}
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default ShiftSelection;


import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../Styles/ListProfesionals.css";
import NavBar from '../Componentes/NavBar';

Modal.setAppElement('#root');

const ShiftSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const listDoctors = await fetch("http://localhost:3000/doctors");
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
          throw new Error(
            `Error al obtener las especialidades: ${response.status}`
          );
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

  const openModal = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const response = await fetch(`http://localhost:3000/schedules?doctorId=${doctor.id}`);
      if (!response.ok) {
        throw new Error(`Error fetching schedules: ${response.status}`);
      }
      const result = await response.json();
      setSchedules(result.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setSchedules([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality.name.toLowerCase().includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Seleccionar turnos</h2>
      </div>
      <div className="list">
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
        {loading ? (
          <p>Cargando doctores...</p>
        ) : (
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
                <tr key={doctor.id} className={doctor.deleted ? "deleted-doctor" : ""}>
                  <td>{doctor.fullName}</td>                 
                  <td>{doctor.speciality.name}</td>
                  <td>{doctor.license}</td>
                  <td>
                    {!doctor.deleted && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => openModal(doctor)}
                        >
                          Turnos disponibles
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Modal isOpen={showModal} onRequestClose={closeModal}>
          <h3>Turnos disponibles para {selectedDoctor && selectedDoctor.fullName}</h3>
          <ul>
            {schedules.map((schedule) => (
              <li key={schedule.id}>{schedule.date} - {schedule.time}</li>
            ))}
          </ul>
          <button className="btn" type="button" onClick={closeModal}>
            Cerrar
          </button>
        </Modal>
      </div>
    </>
  );
};

export default ShiftSelection;
