import Marketing from "../Componentes/Marketing";

import { useAuth } from "../Componentes/UserContext";
import "../Styles/SpanContinue.css";
import SpanContinue from "../Componentes/SpanContinue";



function Home() {
  const { isLoggedIn } = useAuth;
  

  return (
    <>
      <div className="inicio">
        <section className="container">
          {!isLoggedIn && <h1>BIENVENIDOS A SALUD NET</h1>}
          <p className="pHome">
            En nuestra página podrá consultar sobre los profesionales que
            atienden en Salud Net como también reservar un turno
          </p>      
            <SpanContinue />            
               
        </section>
        <Marketing />
      
      </div>
     
      </>  
   
  );
}
export default Home;
