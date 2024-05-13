import React, { useState } from 'react';

function FormProfesionals() {
  const [form, setForm] = useState({
    NombreyApellido: '',
    mail: '',
    phone: '',
    createdAt:'',
    speciality:'',
    license:'',    
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario({ ...form, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Aquí puedes enviar los datos del formulario al servidor
    fetch('http://localhost:5173/doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formulario),
    })
      .then((response) => {
        if (response.ok) {
          // Manejar éxito
          console.log('Registro exitoso');
          // Puedes redirigir a otra página o mostrar un mensaje de éxito
        } else {
          // Manejar error
          console.error('Error en el registro');
          // Mostrar mensaje de error al usuario
        }
      })
      .catch((error) => {
        console.error('Error al enviar la solicitud:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre y Apellido:</label>
        <input 
          type="text" 
          name="NombreyApellido" 
          value={form.NombreyApellido} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Correo Electrónico:</label>
        <input 
          type="email" 
          name="mail" 
          value={form.mail} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Número de Teléfono:</label>
        <input 
          type="tel" 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Especialidad:</label>
        <input 
          type="text" 
          name="speciality" 
          value={form.speciality} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Licencia:</label>
        <input 
          type="text" 
          name="license" 
          value={form.license} 
          onChange={handleChange} 
        />
      </div>
      {/* Puedes agregar más campos según sea necesario */}
      <button type="submit">Enviar</button>
    </form>
  );
}

export default FormProfesionals;
