import React from 'react';

const ImageParagraph = ({ imageSrc, title, paragraph }) => {
  return (
    <div className="image-paragraph">
      <img src={imageSrc} alt="Imagen" />
      <div className="content">
        <h2>{title}</h2>
        <p>{paragraph}</p>
      </div>
    </div>
  );
};

const Novedades = () => {
  return (
    <div>
      <h1>Novedades</h1>
      <ImageParagraph id="Tecnología"
        imageSrc="https://media.istockphoto.com/id/872676342/es/foto/concepto-de-tecnolog%C3%ADa-m%C3%A9dica-registro-m%C3%A9dico-electr%C3%B3nico.jpg?s=612x612&w=0&k=20&c=_Zg00u1zKtFAeH2EiNaA8htvx8yDFsq568pMl3wpyC0="
        title="Tecnología de vanguardia"
        paragraph="En nuestros consultorios, contamos con tecnología de vanguardia para brindarte diagnósticos precisos y tratamientos efectivos. Nuestros equipos médicos están equipados con las últimas herramientas y dispositivos médicos para asegurar la calidad y eficiencia en cada consulta. Además, mantenemos nuestros consultorios actualizados con los avances tecnológicos más recientes para ofrecerte la mejor atención médica."

      />
    </div>
  );
};

export default Novedades; 
