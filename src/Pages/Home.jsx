import Marketing from "../Componentes/Marketing";
import logoSN from "../assets/logosaludnet.png";
import { useAuth } from "../Componentes/UserContext";
import "../Styles/SpanContinue.css";
import SpanContinue from "../Componentes/SpanContinue";
import Footer from "../Componentes/Footer";
import "../Styles/Footer.css";
function Home() {
  const { isLoggedIn } = useAuth;
  

  return (
    <>
      <div className="inicio">
        <section className="container">
        <img src={logoSN} alt="Logo de Salud Net" className="logo" />
          {!isLoggedIn && <h1 className="tittleHome">BIENVENIDOS A SALUD NET</h1>}
          <p className="pHome">
            En nuestra página podrá consultar sobre los profesionales que
            atienden en Salud Net como también reservar un turno
          </p>      
            <SpanContinue />            
               
        </section>
        <Marketing />

      </div>
     
     
   <Footer />
   </>
  );
}
export default Home;
