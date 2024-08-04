// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import NavBar from "./NavBar";
// import Swal from 'sweetalert2';
// import { getToken } from "../Auth/tokenUtils";

// const DeleteSchedule = () => {
//   const [currentDoctorId, setCurrentDoctorId] = useState("");
//   const [deletionReason, setDeletionReason] = useState("error administrativo");
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleDoctorIdChange = (e) => setCurrentDoctorId(e.target.value);
//   const handleReasonChange = (e) => setDeletionReason(e.target.value);

//   const handleDatesChange = (date) => {
//     const newDate = date.toDateString();
//     setSelectedDates((prevDates) =>
//       prevDates.includes(newDate)
//         ? prevDates.filter((d) => d !== newDate)
//         : [...prevDates, newDate]
//     );
//   };

//   const handleDeleteSchedule = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const token = getToken();

//   if (!token) {
//     Swal.fire({
//       icon: 'error',
//       html: '<span>Error</span>',
//       text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
//     });
//     return;
//   }

//     const requests = selectedDates.map(async (date) => {
//       const formattedDate = new Date(date).toISOString().split("T")[0];
//       const endpoint = `http://localhost:3000/schedules/${currentDoctorId}/${formattedDate}`;

//       try {
//         const response = await fetch(endpoint, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//              'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ deletionReason }),
//         });

//         if (response.ok) {
//           return response;
//         } else {
//           throw new Error('Error al eliminar el horario');
//         }
//       } catch (error) {
//         throw new Error('Error de red al eliminar el horario');
//       }
//     });

//     try {
//       const responses = await Promise.all(requests);
//       const successfulResponses = responses.filter((res) => res.status === 200);
//       if (successfulResponses.length > 0) {
//         setSuccess(`Se han eliminado ${successfulResponses.length} horarios exitosamente`);
//         Swal.fire({
//           icon: 'success',
//           html: '<span>Se eliminó la agenda con éxito</span>',
//           text: `Se han eliminado ${successfulResponses.length} horarios exitosamente`,
//         });
//       } else {
//         setError("No se pudo eliminar ningún horario");
//         Swal.fire({
//           icon: 'error',
//           html: '<span>Error</span>',
//           text: "No se pudo eliminar ningún horario. Verifique estar logueado.",
//         });
//       }
//     } catch (err) {
//       setError("Hubo un error al eliminar los horarios");
//       Swal.fire({
//         icon: 'error',
//         html: '<span>Error</span>',
//         text: "Hubo un error al eliminar los horarios. Verifique estar logueado.",
//       });
//     }
//   };

//   return (
//     <>
//       <NavBar showLinks={true} />
//       <div className="barra-superior">
//         <h2 className="titulo-section">Administrar agenda: Eliminar</h2>
//       </div>
//       <div className="formContainer">
//         <form className="createDeleteForm" onSubmit={handleDeleteSchedule}>
//           <div className="inputContainerSchedule">
//             <div className="input-container">
//               <input
//                 className="inputSchedule"
//                 type="text"
//                 value={currentDoctorId}
//                 onChange={handleDoctorIdChange}
//                 placeholder="Matrícula"
//               />
//               <label>Razón de eliminación:</label>
//               <select value={deletionReason} onChange={handleReasonChange}>
//                 <option value="error administrativo">Error administrativo</option>
//                 <option value="cancelación del doctor">Cancelación del doctor</option>
//                 <option value="otro">Otro</option>
//               </select>
//             </div>
//             <label>
//               <Calendar
//                 onClickDay={handleDatesChange}
//                 tileDisabled={({ date }) => date < new Date()}
//                 tileClassName={({ date }) =>
//                   selectedDates.includes(date.toDateString()) ? "selected" : null
//                 }
//               />
//             </label>
//           </div>
//           <button className="btnCreateDelete" type="submit">
//             Eliminar Agenda
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default DeleteSchedule;
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NavBar from "./NavBar";
import Swal from "sweetalert2";
import { getToken } from "../Auth/tokenUtils";

const DeleteSchedule = () => {
  const [currentLicense, setCurrentLicense] = useState(""); // Nuevo estado para la licencia
  const [deletionReason, setDeletionReason] = useState("error administrativo");
  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLicenseChange = (e) => setCurrentLicense(e.target.value);
  const handleReasonChange = (e) => setDeletionReason(e.target.value);

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
        icon: "error",
        html: "<span>Error</span>",
        text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/doctors/license/${license}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token de autenticación aquí
          },
        }
      );
      if (!response.ok) {
        throw new Error("Doctor no encontrado");
      }
      const doctor = await response.json();
      return doctor.id;
    } catch (error) {
      throw new Error("Error al buscar el doctor");
    }
  };

  const handleDeleteSchedule = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "error",
        html: "<span>Error</span>",
        text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
      });
      return;
    }

    const today = new Date().toDateString();
    if (selectedDates.some((date) => new Date(date) < new Date(today))) {
      Swal.fire({
        icon: "error",
        html: "<span>Error</span>",
        text: "No puedes seleccionar fechas anteriores a la fecha actual",
      });
      return;
    }

    try {
      const doctorId = await getDoctorIdByLicense(currentLicense);
      if (!doctorId) {
        throw new Error("ID del doctor no encontrado");
      }

      const requests = selectedDates.map(async (date) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        const endpoint = `http://localhost:3000/schedules/${doctorId}/${formattedDate}`;

        try {
          const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ deletionReason }),
          });

          // Manejo de la respuesta
          if (response.ok) {
            const responseBody = await response.json();

            if (responseBody.statusCode === 200) {
              return response;
            } else {
              throw new Error("Error en la respuesta del servidor");
            }
          } else {
            throw new Error("Error al eliminar el horario");
          }
        } catch (error) {
          console.error("Error de red al eliminar el horario:", error); // Log para depuración
          throw new Error("Error de red al eliminar el horario");
        }
      });

      const responses = await Promise.all(requests);
      const successfulResponses = responses.filter((res) => res.status === 200); // Solo considerar status 200
      if (successfulResponses.length > 0) {
        setSuccess(
          `Se han eliminado ${successfulResponses.length} horarios exitosamente`
        );
        Swal.fire({
          icon: "success",
          html: "<span>Se eliminó la agenda con éxito</span>",
          text: `Se han eliminado ${successfulResponses.length} horarios exitosamente`,
        }).then(() => {
          window.location.reload();
        });
      } else {
        setError("No se pudo eliminar ningún horario");
        Swal.fire({
          icon: "error",
          html: "<span>Error</span>",
          text: "No se pudo eliminar ningún horario. Verifique estar logueado.",
        });
      }
    } catch (err) {
      console.error("Hubo un error al eliminar los horarios:", err); // Log para depuración
      setError("Hubo un error al eliminar los horarios");
      Swal.fire({
        icon: "error",
        html: "<span>Error</span>",
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
                value={currentLicense}
                onChange={handleLicenseChange}
                placeholder="Número de Matrícula"
              />
              <label>Razón de eliminación:</label>
              <select value={deletionReason} onChange={handleReasonChange}>
                <option value="error administrativo">
                  Error administrativo
                </option>
                <option value="cancelación del doctor">
                  Cancelación del doctor
                </option>
                <option value="otro">Otro</option>
              </select>
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
            Eliminar Agenda
          </button>
        </form>
      </div>
    </>
  );
};

export default DeleteSchedule;
