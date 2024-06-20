import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../Styles/ListProfesionals.css";
import NavBar from '../Componentes/NavBar';


const ListProfesionals = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    fullName: "",
    mail: "",
    phone: "",
    speciality: { id: "", name: "" },
    license: "",
  });
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
          throw new Error(
            `Error al obtener las especialidades: ${response.status}`
          );
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
  const openModal = (doctor) => {
    setEditData(doctor);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditData({
      id: "",
      fullName: "",
      mail: "",
      phone: "",
      speciality: { id: "", name: "" },
      license: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "speciality") {
      const selectedSpeciality = specialities.find(
        (speciality) => speciality.id === value
      );
      setEditData((prevData) => ({
        ...prevData,
        speciality: selectedSpeciality
          ? { id: selectedSpeciality.id, name: selectedSpeciality.name }
          : { id: "", name: "" },
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const { id, fullName, mail, phone, speciality, license } = editData;
    const updateDoctor = {
      fullName,
      mail,
      phone,
      speciality: { id: speciality.id, name: speciality.name },
      license,
    };
    try {
      const response = await fetch(`http://localhost:3000/doctors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateDoctor),
      });
      const data = await response.json();
      setDoctors(doctors.map((doc) => (doc.id === id ? data.data : doc)));
      closeModal();
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/doctors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting doctor: ${response.status}`);
      }
      await response.json();
      setDoctors((prevDoctors) => prevDoctors.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
    const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch = doctor.speciality.name.toLowerCase().includes(searchSpeciality.toLowerCase());
    return fullNameMatch && specialityMatch;
  });





  return (
<>
 <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar Profesionales: editar/eliminar</h2>
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
      {loading ? (
        <p>Cargando doctores...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Especialidad</th>
              <th>Licencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr
                key={doctor.id}
                className={doctor.deleted ? "deleted-doctor" : ""}
              >
                <td>{doctor.fullName}</td>
                <td>{doctor.mail}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.speciality.name}</td>
                <td>{doctor.license}</td>
                <td>
                  {!doctor.deleted && (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => openModal(doctor)}
                      >
                        Editar
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <Modal  isOpen={showModal} onRequestClose={closeModal} className=" formContainer" >
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar Profesionales: editar/eliminar</h2>
      </div>
        
        <form className= " createForm-Profesionals" onSubmit={handleSave}>
          <label htmlFor="fullName">Nombre y Apellido</label>
          <input
            type="text"
          
            name="fullName"
            value={editData.fullName}
            onChange={handleChange}
          />
          <label htmlFor="mail">Correo:</label>
          <input
            type="email"
        
            name="mail"
            value={editData.mail}
            onChange={handleChange}
          />
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
          
            name="phone"
            value={editData.phone}
            onChange={handleChange}
          />
          <label htmlFor="speciality">Especialidad:</label>
          <select
         
            name="speciality"
            value={editData.speciality.id}
            onChange={handleChange}
          >
            <option value="">Seleccionar especialidad</option>
            {specialities.map((speciality) => (
              <option key={speciality.id} value={speciality.id}>
                {speciality.name}
              </option>
            ))}
          </select>
          <label htmlFor="license">Licencia:</label>
          <input
            type="text"
         
            name="license"
            value={editData.license}
            onChange={handleChange}
          /><div className="btn-container">
          <button className= "edit-button" type="submit">Guardar</button>
          <button className= "delete-button" type="button" onClick={closeModal}>
            Cancelar
          </button>
          </div>
        </form>
      </Modal>
    
  
    </>
  );
};

export default ListProfesionals;