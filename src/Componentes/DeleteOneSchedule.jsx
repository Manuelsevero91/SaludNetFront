//Este componente se incluirá en la próxima versión de nuestra aplicación

// import React, { useState } from "react";
// import NavBar from "./NavBar";
// import Swal from 'sweetalert2';

const DeleteOneSchedule = () => {
//   const [currentDoctorId, setCurrentDoctorId] = useState("");
//   const [deletionReason, setDeletionReason] = useState("error administrativo");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [startTime, setStartTime] = useState("");

//   const handleDoctorIdChange = (e) => setCurrentDoctorId(e.target.value);
//   const handleReasonChange = (e) => setDeletionReason(e.target.value);
//   const handleDateChange = (e) => setSelectedDate(e.target.value);
//   const handleStartTimeChange = (e) => setStartTime(e.target.value);

//   const handleDeleteSchedule = async (e) => {
//     e.preventDefault();

//     const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
//     const endpoint = `http://localhost:3000/schedules/${currentDoctorId}/${formattedDate}/${startTime}`;

//     try {
//       const response = await fetch(endpoint, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ deletionReason }),
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         if (responseData.message.includes("ya se encuentra eliminada")) {
//           Swal.fire({
//             icon: 'warning',
//             html: <span>La agenda ya estaba borrada</span>,
//             text: "La agenda ya estaba borrada",
//           }).then(() => {
//             window.location.reload(); // Recargar la página
//           });
//         } else {
//           Swal.fire({
//             icon: 'success',
//             html: '<span>Se eliminó la agenda con éxito</span>',
//             text: "Se ha eliminado el horario exitosamente",
//           }).then(() => {
//             window.location.reload(); // Recargar la página
//           });
//         }
//       } else {
//         Swal.fire({
//           icon: 'error',
//           html: '<span>Error</span>',
//           text: responseData.message || "No se pudo eliminar el horario",
//         });
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: 'error',
//         html: '<span>Error</span>',
//         text: "Hubo un error al eliminar el horario",
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
//                 placeholder="Doctor Id"
//               />
//               <label>Razón de eliminación:</label>
//               <select value={deletionReason} onChange={handleReasonChange}>
//                 <option value="error administrativo">Error administrativo</option>
//                 <option value="cancelación del doctor">Cancelación del doctor</option>
//                 <option value="otro">Otro</option>
//               </select>
//               <label>Fecha:</label>
//               <input
//                 className="inputSchedule"
//                 type="date"
//                 value={selectedDate}
//                 onChange={handleDateChange}
//               />
//               <label>Hora de Inicio:</label>
//               <input
//                 className="inputSchedule"
//                 type="time"
//                 value={startTime}
//                 onChange={handleStartTimeChange}
//               />
//             </div>
//           </div>
//           <button className="btn" type="submit">
//             Eliminar turno
//           </button>
//         </form>
//       </div>
//     </>
//   );
};

export default DeleteOneSchedule;

