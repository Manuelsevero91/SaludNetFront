import React, { useEffect, useState } from "react";
import NavBar from '../Componentes/NavBar';

const Profesionals = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialities, setSpecialities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");

  const doctorImages = [
    "https://media.istockphoto.com/id/1201439096/es/foto/profesional-m%C3%A9dico-masculino-conf%C3%ADa-en-el-estudio.jpg?s=612x612&w=0&k=20&c=VRMhRHSSKG23cV4t486AsV0ukHRdfscNbaREOy96of4=",
    "https://media.istockphoto.com/id/1468678629/es/foto/retrato-atenci%C3%B3n-m%C3%A9dica-y-tableta-con-una-mujer-m%C3%A9dico-trabajando-en-un-hospital-para.jpg?s=612x612&w=0&k=20&c=baFmbRhro7mVQ5if_d6uTixa7i6vQg0MSc83YsLp9X0=",
    "https://media.istockphoto.com/id/1486172842/es/foto/retrato-de-enfermero-en-su-oficina.jpg?s=612x612&w=0&k=20&c=9joSTJvZYCAjCx5MPjd21XH2p2pRmfi35jtQXonNJtM=",
    "https://media.istockphoto.com/id/1397680558/es/foto/doctora-vestida-con-uniforme-y-de-pie.jpg?s=612x612&w=0&k=20&c=_ACOtpa6FxC2BNIygYE7sT28GSvtXVGcisuPWLRFup0=",
    "https://media.istockphoto.com/id/1326546995/es/foto/profesional-de-la-salud-sonriendo-en-el-trabajo.jpg?s=612x612&w=0&k=20&c=y0anuMJaFRbxWLmOppyK4BW2N-IqRAaZ7fvlRN4zfBE=",
    "https://media.istockphoto.com/id/1021562784/es/foto/sonriente-m%C3%A9dico-de-confianza.jpg?s=612x612&w=0&k=20&c=jIk92h0AFpM-QIu7hnKVJK0Q2ZSbV-tgQMXC2LncXI4="
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const listDoctors = await fetch("http://localhost:3000/doctors");
        const result = await listDoctors.json();
        const doctorsWithPhotos = result.data.map((doctor, index) => ({
          ...doctor,
          photo: doctorImages[index % doctorImages.length], // Asigna una imagen de manera cíclica
        }));
        setDoctors(doctorsWithPhotos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await fetch("http://localhost:3000/speciality");
        if (!response.ok) {
          throw new Error(`Error al obtener las especialidades: ${response.status}`);
        }
        const responseData = await response.json();
        setSpecialities(responseData.data);
      } catch (error) {
        console.error("No se pudo obtener la lista de especialidades", error);
      }
    };

    fetchDoctors();
    fetchSpecialities();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality?.name.toLowerCase().includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Nuestros Profesionales</h2>
      </div>
      <div className="search-bar">
        <label htmlFor="searchName">Nombre:</label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label htmlFor="searchSpeciality">Especialidad:</label>
        <select
          id="searchSpeciality"
          value={searchSpeciality}
          onChange={(e) => setSearchSpeciality(e.target.value)}
        >
          <option value="">Todas</option>
          {specialities.map((speciality) => (
            <option key={speciality.id} value={speciality.name}>
              {speciality.name}
            </option>
          ))}
        </select>
      </div>
      <div className="cards-container">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="card">
            <img className="card-image" src={doctor.photo} alt={doctor.fullName} />
            <div className="card-content">
              <h3>{doctor.fullName}</h3>
              <h4>{doctor.speciality.name}</h4>
              <h4>{doctor.license}</h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profesionals;

