import React, { useState } from 'react';
import Swal from 'sweetalert2';
import logoSN from '../assets/logosaludnet.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Componentes/UserContext';
import NavBar from '../Componentes/NavBar';
import NotFoundImage from '../assets/not-found.jpg';
import "../Styles/SharedStyles/Btn.css";

function Login({ isLoggedIn }) {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredEmail = e.target.email.value;
    const enteredPassword = e.target.password.value;

    const formData = {
      email: enteredEmail,
      password: enteredPassword
    };

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      Swal.fire({
        imageUrl: logoSN,
        imageHeight: 250,
        imageWidth: 250,
        html: `<p>Bienvenido <b>${enteredUsername}</b> a nuestro sitio.</p>`,
        timer: 3000,
      });

      handleLogin(enteredEmail);
      navigate('/admin');
    } catch (error) {
      setError(true);
      Swal.fire({
        imageUrl: logoSN,
        imageHeight: 250,
        imageWidth: 250,
        html: `<p>${error.message}HOLAAAAA</p>`,
        timer: 3000,
      });
    }

    e.target.reset();
  };

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Inicio de Sesión</h2>
      </div>
      <div className='formContainerInicio'>
        <form className='createFormInicio' onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Usuario</label>
            <input
              className='inputInicio'
              type="text"
              name="username"
              minLength={6}
              placeholder="Introduzca su nombre"
              required
            />
          </div>
          <div className="input-container">
            <label>Mail</label>
            <input
              className='inputInicio'
              type="email"
              name="email"
              placeholder="Introduzca su mail"
            />
          </div>
          <div className="input-container">
            <label> Contraseña</label>
            <input
              className='inputInicio'
              type="password"
              name="password"
              placeholder="Introduzca su contraseña"
            />
          </div>
          <button className="btn" type="submit">Enviar</button>
        </form>
        {isLoggedIn && <p>Usuario autenticado</p>}
      </div>
    </>
  );
}

export default Login;
