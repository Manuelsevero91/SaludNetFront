import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";

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
        throw new Error(
          "Error al obtener las especialidades: " + error.message
        );
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
        setSuccess("Registro exitoso");
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
        setError(`Error en el registro`);
        setSuccess("");
      }
    } catch (error) {
      setError(`Error al enviar la solicitud`);
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
      </div>
      <div className="formContainer">      

        <form className="createForm-Profesionals" onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Nombre y Apellido:</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label>Correo Electrónico:</label>
            <input              
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
            />
          </div>
          <div className="input-container" >
            <label>Número de Teléfono:</label>
            <input              
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="input-container" >
            <label>Licencia:</label>
            <input              
              type="text"
              name="license"
              value={form.license}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label>Especialidad:</label>
            <select
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
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
          {error && <div className="error-message" >{error}</div>}
        {success && <div className="succes-message">{success}</div>}

        </form>
      </div>
    </>
  );
}

export default FormProfesionals;
