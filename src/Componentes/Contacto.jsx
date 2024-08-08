import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";

const Contacto = () => {

  return (
    <>

      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Contacto</h2>
      </div>
      <div className="container">
        <div className="information-container">
          <h2>INFORMACIÓN DE SALUD NET</h2>
          <p>saludnetbenitojuarez@gmail.com</p>
          <p>Tel: 02292-451751  Cel:2281457000</p>
          <p>#saludnetbj &nbsp; &nbsp; &nbsp; &nbsp;facebook.com/saludnet.bj</p>
          <p>Cayetano Zibecchi 74, Benito Juárez, Buenos Aires, Argentina</p>
          <div className="social-icons-information">
            <a href="https://www.facebook.com/" className="social-icon">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com/" className="social-icon">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://www.instagram.com/" className="social-icon">
              <FontAwesomeIcon icon={faInstagram} />
            </a>

          </div>

        </div>
      </div>


    </>
  );
};

export default Contacto;
