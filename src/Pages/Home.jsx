import React, { useRef } from "react";
import Marketing from "../Componentes/Marketing";
import logoSN from "../assets/logosaludnet.png";
import { useAuth } from "../Componentes/UserContext";
import SpanContinue from "../Componentes/SpanContinue";
import Footer from "../Componentes/Footer";
import "../Styles/Footer.css";
import { Link } from "react-router-dom";



function Home() {
  const { isLoggedIn } = useAuth;
  const marketingRef = useRef(null);
  return (
    <>
      <div className="general-container">

        <div className="inicio">

          <div className="headerHome">

            <img src={logoSN} alt="Logo de Salud Net" className="logo" />
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </div>
          {!isLoggedIn && <h1 className="tittleHome">BIENVENIDOS A SALUD NET</h1>}
          <p className="pHome">
            En nuestra página podrá consultar sobre los profesionales que atienden
            en Salud Net como también reservar un turno
          </p>
          <SpanContinue marketingRef={marketingRef} />
        </div>



        <div ref={marketingRef}>
          <Marketing />
        </div>
        <Footer />
      </div>
    </>
  );
}
export default Home;
