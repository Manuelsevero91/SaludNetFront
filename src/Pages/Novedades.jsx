import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NavBar from '../Componentes/NavBar';

const Novedades = () => {
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
      imageSrc: "https://media.istockphoto.com/id/1281627829/es/foto/moderno-quir%C3%B3fano-en-un-hospital-generado-digitalmente.jpg?s=612x612&w=0&k=20&c=VmNUWnde9iYLqHDQiEseKNFyoVvll3lWvl51v-tkgd4=",
      title: "En nuestros consultorios, contamos con tecnología de vanguardia para brindarte diagnósticos precisos y tratamientos efectivos. Nuestros equipos médicos están equipados con las últimas herramientas y dispositivos médicos para asegurar la calidad y eficiencia en cada consulta. Además, mantenemos nuestros consultorios actualizados con los avances tecnológicos más recientes para ofrecerte la mejor atención médica."
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
        <h2 className="titulo-section">Novedades</h2>
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

export default Novedades;
