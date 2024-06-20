import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NavBar from '../Componentes/NavBar';

const SobreNosotros = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const slides = [
    {
      imageSrc: "https://img.freepik.com/fotos-premium/diversidad-atencion-medica-manos-medicos-asociacion-trabajo-equipo-exito-medicina-apoyo-motivacion-trabajadores-medicos-gesto-mano-mision-ayuda-solidaria-objetivos-colaboracion_590464-153584.jpg",
      title: "Salud Net nació en el 2016 como iniciativa de un conjunto de profesionales con la misión de mejorar la salud en las personas. Nuestro propósito es ofrecer una calidad de atención eficaz al servicios de atención de la salud basados en la evidencia; segura al evitar daños a las personas a las que está destinado el cuidado; oportuna al reducir los tiempos de espera y eficiente maximizando el beneficio de los recursos disponibles y evitando el desperdicio."
    },
    {
      imageSrc: "https://bancosdeimagenes.com/wp-content/uploads/2019/03/Getty-Medical-Category-768x443-1.jpg",
      title: "Ofrecemos una gran variedad de especialidades para brindar un cuidado integral que se base en la prevención de enfermedades y en la promoción de hábitos saludables para una población con una creciente expectativa de vida. Nuestros profesionales están comprometidos en ofrecer una atención de salud de alta calidad, asegurando que cada paciente reciba el mejor cuidado posible, adaptado a sus necesidades individuales."
    }
  ];

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Sobre Nosotros</h2>
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index}>
              <img src={slide.imageSrc} alt={`Slide ${index + 1}`} />
              <p>{slide.title}</p>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default SobreNosotros;
