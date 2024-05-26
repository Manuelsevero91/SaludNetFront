import React, { useState } from 'react';
import Swal from 'sweetalert2';
import logoSN from '../assets/logosaludnet.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Componentes/UserContext';
import NavBar from '../Componentes/NavBar';
import NotFoundImage from '../assets/not-found.jpg';

function Login({ isLoggedIn }) {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredUsername = e.target.nombre.value;
    const enteredPassword = e.target.password.value;

    // Simulación de usuario y contraseña
    const simulatedUsername = 'admin';
    const simulatedPassword = 'admin123';

    if (enteredUsername === simulatedUsername && enteredPassword === simulatedPassword) {
      Swal.fire({
        imageUrl: logoSN,
        imageHeight: 250,
        imageWidth: 250,
        html: `<p>Bienvenido <b>${enteredUsername}</b> a nuestro sitio.</p> `,
        timer: 3000,
      });
      handleLogin(enteredUsername);
      navigate('/admin');
    } else {
      setError(true);
      Swal.fire({
        imageUrl: logoSN,
        imageHeight: 250,
        imageWidth: 250,
        html: `<p>El <b>usuario</b> o la <b>contraseña</b> ingresados son incorrectos, por favor inténtelo de nuevo.</p> `,
        timer: 3000,
      });
    }

    e.target.reset();
  };

  return (
    <>
     <NavBar showLinks={false} />
      <div className='login'>
        <form onSubmit={handleSubmit}>
          <h3 id="inicioSesion"><strong>Iniciar Sesión</strong></h3>
          <label htmlFor="nombre"><strong>Usuario</strong></label>
          <input type="text" name="nombre" id="nombre" placeholder="Introduzca su nombre" style={{ display: 'block' }} />
          <label htmlFor="password"><strong>Contraseña</strong></label>
          <input type="password" name="password" id="password" placeholder="Introduzca su contraseña" style={{ display: 'block' }} />
          {error && <p style={{ color: 'red' }}>El usuario o la contraseña ingresados son incorrectos.</p>}
          <button id="enviarLogin" type="submit">Enviar</button>
        </form>
        {isLoggedIn && <p>Usuario autenticado</p>}
      </div>
    </>
  );
}

export default Login;
