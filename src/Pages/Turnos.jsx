// import React, { useState, useEffect } from "react";
// import Spinner from "../Componentes/Spinner";
// import Swal from "sweetalert2";
// import NavBar from "../Componentes/NavBar";

// const Turnos = () => {
//   const [patientData, setPatientData] = useState({
//     fullName: "",
//     dni: "",
//     mail: "",
//     phone: "",
//     address: "",
//     birthday: "",
//   });

//   const [doctorId, setDoctorId] = useState(null);
//   const [scheduleId, setScheduleId] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/doctors");
//         if (!response.ok) {
//           throw new Error(`Error fetching doctors: ${response.status}`);
//         }
//         const result = await response.json();
//         setDoctors(result.data);
//         setTimeout(() => {
//           setLoadingDoctors(false);
//         }, 2000);
//       } catch (error) {
//         setLoadingDoctors(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   useEffect(() => {
//     const fetchSchedules = async () => {
//       if (doctorId) {
//         try {
//           const response = await fetch(`http://localhost:3000/schedules/by-doctor/${doctorId}`);
//           if (!response.ok) {
//             throw new Error(`Error fetching schedules: ${response.status}`);
//           }
//           const data = await response.json();
  
//           if (data.data.length === 0) {
//             Swal.fire({
//               text: "El doctor no tiene turnos disponibles",
//               icon: "warning",
//             });
//           } else {
//             setSchedules(data.data);
//           }
          
//         } catch (error) {
//           Swal.fire({
//             text: "El Profesional no tiene turnos disponibles",
//             icon: "error",
//           });
//         }
//       } else {
//         setSchedules([]);
//       }
//     };
  
//     fetchSchedules();
//   }, [doctorId]);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPatientData({
//       ...patientData,
//       [name]: value,
//     });
//   };

//   const handleDoctorChange = (e) => {
//     setDoctorId(e.target.value);
//   };

//   const handleScheduleChange = (e) => {
//     setScheduleId(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const patientResponse = await fetch("http://localhost:3000/patients", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(patientData),
//       });

//       if (!patientResponse.ok) {
//         throw new Error("Error creating patient");
//       }

//       const patientResult = await patientResponse.json();
//       const patientId = patientResult.data.id;

//       const shiffResponse = await fetch("http://localhost:3000/shiff", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           idSchedule: scheduleId,
//           idPatient: patientId,
//         }),
//       });

//       if (!shiffResponse.ok) {
//         throw new Error("Error creando el turno");
//       }
//       Swal.fire({ text: "Turno reservado con éxito", icon: "success" });
//       setPatientData({
//         fullName: "",
//         dni: "",
//         mail: "",
//         phone: "",
//         address: "",
//         birthday: "",
//       });
//       setDoctorId(null);
//       setScheduleId(null);
//       setSchedules([]);
//       setDoctors([]);
//     } catch (error) {
//       Swal.fire({ text: "Hubo un error al reservar el turno", icon: "error" });
//     }
//   };

//   return (
//     <>
//       <NavBar showLinks={false} />
//       <div className="barra-superior">
//         <h2 className="titulo-section">Reserva de turnos</h2>
//       </div>

//       <Spinner loading={loadingDoctors} />

//       <div className="formContainer">
//         <form className="createForm" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="fullName"
//             value={patientData.fullName}
//             onChange={handleInputChange}
//             placeholder="NOMBRE Y Apellido"
//             required
//           />
//           <input
//             type="text"
//             name="dni"
//             value={patientData.dni}
//             onChange={handleInputChange}
//             placeholder="DNI"
//             required
//           />
//           <input
//             type="email"
//             name="mail"
//             value={patientData.mail}
//             onChange={handleInputChange}
//             placeholder="MAIL"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             value={patientData.phone}
//             onChange={handleInputChange}
//             placeholder="CELULAR"
//             required
//           />
//           <input
//             type="text"
//             name="address"
//             value={patientData.address}
//             onChange={handleInputChange}
//             placeholder="DOMICILIO"
//             required
//           />
//           <input
//             type="text"
//             name="birthday"
//             value={patientData.birthday}
//             onChange={handleInputChange}
//             placeholder="FECHA DE NACIMIENTO: AAAA-MM-DD"
//             required
//           />
//           <select onChange={handleDoctorChange} required>
//             <option value="">Seleccione un doctor</option>
//             {doctors.map((doctor) => (
//               <option key={doctor.id} value={doctor.id}>
//                 {doctor.fullName} - {doctor.speciality.name}
//               </option>
//             ))}
//           </select>

//           <select onChange={handleScheduleChange} required>
//             <option value="">Seleccione un horario</option>
//             {schedules.map((schedule) => (
//               <option key={schedule.idSchedule} value={schedule.idSchedule}>
//                 {schedule.day} - {schedule.start_Time}
//               </option>
//             ))}
//           </select>

//           <button className="btn" type="submit">
//             Reservar Turno
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Turnos;


import React, { useState, useEffect } from "react";
import Spinner from "../Componentes/Spinner";
import Swal from "sweetalert2";
import NavBar from "../Componentes/NavBar";

const Turnos = () => {
  const [patientData, setPatientData] = useState({
    fullName: "",
    dni: "",
    mail: "",
    phone: "",
    address: "",
    birthday: "",
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

          if (data.data.length === 0) {
            Swal.fire({
              text: "El doctor no tiene turnos disponibles",
              icon: "warning",
            });
          } else {
            // Ordenamos los horarios por día y hora de inicio
            const sortedSchedules = data.data.sort((a, b) => {
              if (a.day !== b.day) {
                return new Date(a.day) - new Date(b.day); // Ordenamos por fecha
              }
              return a.start_Time.localeCompare(b.start_Time); // Si el día es el mismo, ordenamos por hora de inicio
            });

            setSchedules(sortedSchedules);
          }
          
        } catch (error) {
          Swal.fire({
            text: "El Profesional no tiene turnos disponibles",
            icon: "error",
          });
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
      const patientResponse = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!patientResponse.ok) {
        throw new Error("Error creating patient");
      }

      const patientResult = await patientResponse.json();
      const patientId = patientResult.data.id;

      const shiffResponse = await fetch("http://localhost:3000/shiff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idSchedule: scheduleId,
          idPatient: patientId,
        }),
      });

      if (!shiffResponse.ok) {
        throw new Error("Error creando el turno");
      }
      Swal.fire({ text: "Turno reservado con éxito", icon: "success" });
      setPatientData({
        fullName: "",
        dni: "",
        mail: "",
        phone: "",
        address: "",
        birthday: "",
      });
      setDoctorId(null);
      setScheduleId(null);
      setSchedules([]);
      setDoctors([]);
    } catch (error) {
      Swal.fire({ text: "Hubo un error al reservar el turno", icon: "error" });
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
        <form className="createForm" onSubmit={handleSubmit}>
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

          <button className="btn" type="submit">
            Reservar Turno
          </button>
        </form>
      </div>
    </>
  );
};

export default Turnos;

