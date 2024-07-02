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
     <div className="barra-superior">
        <h2 className="titulo-section">Inicio de Sesión</h2>
      </div>
      <div className='formContainerInicio'>
        <form className= 'createFormInicio' onSubmit={handleSubmit}>
        <div className="input-container">         
          <label >Usuario</label>
          <input className='inputInicio'
           type="text"
           name="nombre" 
           placeholder="Introduzca su nombre" />           
          </div>
          <div className="input-container">   
          <label > Contraseña</label>
          <input className='inputInicio'
          type="password" 
          name="password" 
          placeholder="Introduzca su contraseña" />  
          </div>       
          <button className="btn" type="submit">Enviar</button>
        </form>
        {isLoggedIn && <p>Usuario autenticado</p>}
      </div>
    </>
     );
    }

export default Login;
