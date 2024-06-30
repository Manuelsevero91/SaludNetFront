import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";
import Swal from "sweetalert2";

function FormProfesionals() {
  const [form, setForm] = useState({
    fullName: "",
    mail: "",
    phone: "",
    speciality: "",
    license: "",
  });
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await fetch("http://localhost:3000/speciality");

        if (!response.ok) {
          throw new Error(
            "Error al obtener las especialidades: " + response.status
          );
        }

        const responseData = await response.json();

        setSpecialities(responseData.data);
      } catch (error) {
        Swal.fire({
          text: "No se pudo obtener la lista de especialidades",
          icon: "error",
        });
      }
    };

    fetchSpecialities();
  }, []);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        Swal.fire({ html: "<span class='custom-swal-title'>El profesional ha sido agregado</span>"},"success");
        setError("");
        setForm({
          fullName: "",
          mail: "",
          phone: "",
          speciality: "",
          license: "",
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          text: "Error en el registro del profesional",
          icon: "error",
        });
        setSuccess("");
      }
    } catch (error) {
      Swal.fire({
        text: "Error en el registro del profesional",
        icon: "error",
      });
      setSuccess("");
    }
  };
  const handleReset = () => {
    setError("");
    setSuccess("");
  };

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar Profesionales: registrar</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="succes-message">{success}</div>}
      </div>
      <div className="formContainer">
        <form className="createForm" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="NOMBRE Y Apellido"
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
              placeholder="MAIL"
            />
          </div>
          <div className="input-container">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="CELULAR"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="license"
              value={form.license}
              onChange={handleChange}
              placeholder="Matrícula"
            />
          </div>
          <div className="input-container">
            <select
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              placeholder="Especialidad"
            >
              <option value="">Seleccione una especialidad</option>
              {specialities.map((speciality) => (
                <option key={speciality.id} value={speciality.id}>
                  {speciality.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}

export default FormProfesionals;
