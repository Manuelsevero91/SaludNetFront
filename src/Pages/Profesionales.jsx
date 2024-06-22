import React, { useEffect, useState } from "react";
import NavBar from '../Componentes/NavBar';

const Profesionals = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialities, setSpecialities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const listDoctors = await fetch("http://localhost:3000/doctors");
        const result = await listDoctors.json();
        setDoctors(result.data);
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
        console.error("Error fetching specialities:", error);
      }
    };

    fetchDoctors();
    fetchSpecialities();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality.name.toLowerCase().includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });

  // const getRandomImageUrl = () => {
  //   return `https://source.unsplash.com/random/200x200?sig=${Math.random()}`;
  // };

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
            <img  className="card-image" src='https://media.istockphoto.com/id/174762332/es/foto/sonriente-enfermera.jpg?s=612x612&w=0&k=20&c=WkygicrUf8D6tj-lFcJ3tHTuIMDRtrAmWAc5ImZJTcM=' alt="Doctor" />
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