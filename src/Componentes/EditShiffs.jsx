import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Swal from "sweetalert2";
import NavBar from "./NavBar";

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
            patient,
            doctor,
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
      title: "¿Está seguro de eliminar el registro?",
      text: "No podrás revertir ésto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, deseo eliminarlo",
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
        <h2 className="titulo-section">Eliminar Turnos</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id Turno</th>
            <th>Doctor</th>
            <th>Paciente</th>
            <th>DNI Paciente</th>
            <th>Telefono Paciente</th>
            <th>Fecha Turno</th>
            <th>Horario Turno</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {shiffs.map((shiff) => (
            <tr key={shiff.id}>
              <td>{shiff.id}</td>
              <td>{ shiff.Schedules.doctorFullName}</td>
              <td>{ shiff.patient.fullName}</td>
              <td>{shiff.patient.dni}</td>
              <td>{ shiff.patient.phone}</td>
              <td>{shiff.Schedules.day}</td>
              <td>{shiff.Schedules.start_Time}</td>
              <td>
                <button onClick={() => handleDelete(shiff.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default EditShiffs;
