
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

  // Función para obtener la lista de doctores
  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:3000/doctors");
      if (!response.ok) {
        throw new Error(`Error al traer doctores: ${response.status}`);
      }
      const result = await response.json();
      setDoctors(result.data);
      setTimeout(() => {
        setLoadingDoctors(false);
      }, 2000);
    } catch (error) {
      setLoadingDoctors(false);
      Swal.fire({
        text: "Error al cargar la lista de doctores",
        icon: "error",
      });
    }
  };

  // Función para obtener los horarios de un doctor específico
  const fetchSchedules = async () => {
    if (doctorId) {
      try {
        const response = await fetch(
          `http://localhost:3000/schedules/by-doctor/${doctorId}`
        );
        if (!response.ok) {
          throw new Error(`Error al traer agenda: ${response.status}`);
        }
        const data = await response.json();

        if (data.data.length === 0) {
          Swal.fire({
            text: "El doctor no tiene turnos disponibles",
            icon: "warning",
          });
        } else {
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

  // Función para manejar cambios en los inputs del paciente
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;

    switch (name) {
      case "phone":
        isValid = /^[1-9]\d{0,9}$/.test(value);
        break;
      case "dni":
        isValid = /^\d{0,8}$/.test(value);
        break;
      case "fullName":
        isValid = value.length <= 25;
        break;
      case "address":
        isValid = value.length <= 25;
        break;
      default:
        break;
    }
    if (isValid || value === "") {
      setPatientData({
        ...patientData,
        [name]: value,
      });
    }
  };

  // Función para manejar el cambio de doctor seleccionado
  const handleDoctorChange = (e) => {
    setDoctorId(e.target.value);
  };

  // Función para manejar el cambio de horario seleccionado
  const handleScheduleChange = (e) => {
    setScheduleId(e.target.value);
  };

  // Función para enviar la reserva del turno
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (patientData.dni.length < 7 || patientData.dni.length > 8) {
      Swal.fire({ text: "El DNI debe tener 7 u 8 dígitos", icon: "error" });
      return;
    }

    if (patientData.phone.length !== 10) {
      Swal.fire({ text: "El teléfono debe tener 10 dígitos", icon: "error" });
      return;
    }

    try {
      let patientId;

      // Buscar paciente por DNI
      const patientResponse = await fetch(
        `http://localhost:3000/patients/by-dni/${patientData.dni}`
      );

      if (patientResponse.ok) {
        const patientDataResponse = await patientResponse.json();
        if (patientDataResponse.data) {
          // Si el paciente ya está registrado, obtén su ID
          patientId = patientDataResponse.data.id;
        }
      } else if (patientResponse.status === 404) {
        // Si el paciente no existe, crear uno nuevo
        const newPatientResponse = await fetch(
          "http://localhost:3000/patients",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(patientData),
          }
        );

        if (newPatientResponse.ok) {
          const newPatientData = await newPatientResponse.json();
          patientId = newPatientData.data.id;
        } else {
          throw new Error(
            `Error al crear paciente: ${newPatientResponse.status}`
          );
        }
      } else {
        throw new Error(`Error al buscar paciente: ${patientResponse.status}`);
      }

      // Reservar turno
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
        throw new Error(await shiffResponse.text());
      }

      Swal.fire({ text: "Turno reservado con éxito", icon: "success" }).then(
        () => {
          // Limpiar formulario y cargar datos nuevamente
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
          fetchDoctors();
          fetchSchedules();
        }
      );
    } catch (error) {
      if (error.message.includes("El paciente con DNI")) {
        const errorMessage = JSON.parse(error.message);
        Swal.fire({
          text: `${errorMessage.message}. Ante cualquier duda, por favor llame al teléfono "2281325016".`,
          icon: "error",
          timer: 5000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          text: error.message || "Hubo un error al reservar el turno",
          icon: "error",
        }).then(() => {
          window.location.reload();
        });
      }
    }
  };

  // Efecto para cargar la lista de doctores al montar el componente
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Efecto para cargar los horarios cuando se selecciona un doctor
  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

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
            placeholder="Nombre Y Apellido"
            required
          />
          <input
            type="text"
            name="dni"
            value={patientData.dni}
            onChange={handleInputChange}
            placeholder="DNI (sin puntos)"
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
            placeholder="CELULAR (Sin el '0' ni '-')"
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
            placeholder="FECHA DE NACIMIENTO (AAAA-MM-DD)"
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
