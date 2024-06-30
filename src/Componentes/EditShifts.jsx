import React, { useState, useEffect } from "react";
import Spinner from "../Componentes/Spinner";
import Swal from "sweetalert2";
import NavBar from "../Componentes/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EditShiffs = () => {
  const [shiffs, setShiffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiffRes, patientRes, doctorRes] = await Promise.all([
          fetch("http://localhost:3000/shiff"),
          fetch("http://localhost:3000/patients"),
          fetch("http://localhost:3000/doctors"),
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      html: "<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/shiff/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error Deleting shiff: ${response.status}`);
        } else {
          await response.json();
          setShiffs((prevShiff) =>
            prevShiff.filter((shiff) => shiff.id !== id)
          );
          Swal.fire("Eliminado", "El Turno ha sido eliminado", "success");
        }
      } catch {
        Swal.fire(
          "Error!",
          "Hubo un error al intentar eliminar el turno",
          "error"
        );
      }
    }
  };

  return (
    <>
      <Spinner loading={loading} />
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Eliminar turnos</h2>
      </div>
      <div>
        <>
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
                {shiffs.map((shiff) => (
                  <tr key={shiff.id}>
                    <td>{shiff.Schedules.doctorFullName}</td>
                    <td>{shiff.patient.fullName}</td>
                    <td>{shiff.patient.phone}</td>
                    <td>{shiff.Schedules.day}</td>
                    <td>{shiff.Schedules.start_Time}</td>
                    <td>
                    <button className="delete-button" onClick={() => handleDelete(doctor.id)}>
                          <FontAwesomeIcon icon={faTrash} /> 
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      </div>
    </>
  );
};

export default EditShiffs;
