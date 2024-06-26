import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Contacto = () => {
  
  return (
<>

      <NavBar showLinks={false}/>
      <div className="barra-superior">
        <h2 className="titulo-section">Contacto</h2>
      </div>
      <div className="container">
        <div className="information-container">       
           <h2>INFORMACIÓN DE SALUD NET</h2> 
           <p>sljvnsafvn</p> 
           <p>sljvnsafvn</p> 
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
