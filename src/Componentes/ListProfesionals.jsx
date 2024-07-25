import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import NavBar from '../Componentes/NavBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faXmark , faPlus} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Spinner from "../Componentes/Spinner";
import { getToken } from "../Auth/tokenUtils";


const ListProfesionals = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    fullName: "",
    mail: "",
    phone: "",
    speciality: { id: 0, name: "" },
    license: "",
    coverages: [],
  });
  const [specialities, setSpecialities] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");
  const [coverages, setCoverages] = useState([]);
  const [selectedCoverage, setSelectedCoverage] = useState("");
  const [actualDoctorId, setActualDoctorId] = useState(null);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
      try {
        const listDoctors = await fetch("http://localhost:3000/doctors", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        const response = await listDoctors.json();
        setDoctors(response.data);
        setLoading(false); 
      } catch (error) {
        Swal.fire({
          text: "No se pudo obtener la lista de profesionales. Verifique estar logueado.",
          icon: "error",
        })
        setLoading(false);
      }
    };
    const fetchSpecialities = async () => {
      const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
      try {
        const response = await fetch("http://localhost:3000/speciality", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error(
            `Error al obtener las especialidades: ${response.status}`
          );
        }
        const responseData = await response.json();
        setSpecialities(responseData.data);
      } catch (error) {
        Swal.fire({
          text: "No se pudo obtener la lista de especialidades",
          icon: "error",
        });
      }
    };
      const fetchCoverage = async () => {
        const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
        try {
          const response = await fetch("http://localhost:3000/coverage", {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error(
              `Error al obtener las coberturas: ${response.status}`
            );
          }
          const responseData = await response.json();
          setCoverages(responseData.data);
        } catch (error) {
          Swal.fire({
            text: "No se pudo obtener la lista de obras sociales",
            icon: "error",
          });
        }
      };
    fetchDoctors();
    fetchSpecialities();
    fetchCoverage();
  }, []);  

  const openModal = (doctor) => {
    setEditData(doctor);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditData({
      id: 0,
      fullName: "",
      mail: "",
      phone: "",
      speciality: { id: 0, name: "" },
      license: "",
      coverages: [],
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "speciality") {
      const selectedSpeciality = specialities.find(
        (speciality) => speciality.id === parseInt(value)
      );
      setEditData((prevData) => ({
        ...prevData,
        speciality: selectedSpeciality || { id: 0, name: "" },
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
        id, 
        fullName,
        mail,
        phone,
        speciality: { id: speciality.id, name: speciality.name },
        license,
      };

      const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
    
      try {
        const response = await fetch(`http://localhost:3000/doctors/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateDoctor),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
       
        setDoctors(doctors.map((doc) => (doc.id === id ? data.data : doc)));
    
        Swal.fire({
          text: "El profesional ha sido actualizado con éxito",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            closeModal();}})
       
      } catch (error) {
        console.error("Error al actualizar el profesional:", error);
    
        Swal.fire({
          text: "El profesional no pudo ser actualizado. Verifique estar logueado.",
          icon: "error",
        });
      }
    };
    
  const handleDelete = async (id) => {
    const token = getToken();
    
    if (!token) {
      Swal.fire({
        icon: 'error',
        html: '<span>Error</span>',
        text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
      });
      return;
    }
    const result = await Swal.fire({    
      html: "<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo",
      cancelButtonText: "Cancelar",
    });
  if (result.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:3000/doctors/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`Error eliminando al profesional: ${response.status}`);
      }     
      await response.json();
      setDoctors((prevDoctors) => prevDoctors.filter((doc) => doc.id !== id));
      Swal.fire("Eliminado", "El profesional ha sido eliminado", "success");
     
    } catch {
      Swal.fire(
        "Error!",
        "Hubo un error al intentar eliminar al profesional. Verifique estar logueado.",
        "error"
      );
    }
  }
}; 

const openCoverageModal = (doctorId) => {
  setActualDoctorId(doctorId);
  setSelectedCoverage(
    doctors.find((doc) => doc.id === doctorId)?.coverages.map((coverage) => coverage.id) || []
  );
  setShowCoverageModal(true);
};

const closeCoverageModal = () => {
  setShowCoverageModal(false);
  setSelectedCoverage([]);
  setActualDoctorId(null);
  window.location.reload();
};

const handleAddCoverage = async () => {
  const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/doctors/addCoverage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ doctorId: actualDoctorId, coverageId: [selectedCoverage] }),
    });
    if (!response.ok) {
      throw new Error(`Error agregando obras sociales: ${response.status}`);
    }
    const data = await response.json();
    setDoctors(doctors.map((doc) => (doc.id === actualDoctorId ? data.data : doc)));
    closeCoverageModal();
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error!",
      "Hubo un error al intentar agregar obras sociales. Verifique estar logueado.",
      "error"
    );
  }
};
const handleRemoveCoverage = async (actualDoctorId, coverageIdToRemove) => {
  const token = getToken();
    
  if (!token) {
    Swal.fire({
      icon: 'error',
      html: '<span>Error</span>',
      text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
    });
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/doctors/remove/coverage`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ doctorId: actualDoctorId, coverageId: [coverageIdToRemove] }),
    });
    if (!response.ok) {
      throw new Error(`Error eliminando obras sociales: ${response.status}`);
    }
    const data = await response.json();
    setDoctors(doctors.map((doc) => (doc.id === actualDoctorId ? data.data : doc)));
    closeCoverageModal();
  } catch (error) {
    Swal.fire(
      "Error!",
      "Hubo un error al intentar eliminar obras sociales. Verifique estar logueado.",
      "error"
    );
  }
};

const handleCoverageChange = (e) => {
  setSelectedCoverage(e.target.value);
};

if (loading) {
return <Spinner loading={loading} />;
}

const filteredDoctors = doctors.filter((doctor) => {
  if (!doctor || !doctor.fullName) return false;
  const fullNameLower = doctor.fullName.toLowerCase();
  const searchNameLower = searchName.toLowerCase();
  const doctorSpecialityId = doctor.speciality.id.toString(); 
  return (
    fullNameLower.includes(searchNameLower) &&
    (searchSpeciality === "" || doctorSpecialityId === searchSpeciality)
  );
});

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar Profesionales: editar/eliminar</h2>
      </div>
      <div className="list">
      <div className="search-bar">    
        <label className="search" htmlFor="searchName">Nombre:</label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label className="search" htmlFor="searchSpeciality">Especialidad:</label>
        <select
          id="searchSpeciality"
          value={searchSpeciality}
          onChange={(e) => setSearchSpeciality(e.target.value)}
        >
          <option value="">Todas</option>
          {specialities.map((speciality) => (
            <option key={speciality.id} value={speciality.id}>
              {speciality.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Cargando doctores...</p>
      ) : (
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Licencia</th>
                <th>Coberturas</th>
                <th></th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className={doctor.deleted ? "deleted-doctor" : ""}>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.mail}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.speciality.name}</td>
                  <td>{doctor.license}</td>
                  <td>
                    {doctor.coverages && doctor.coverages.length > 0 ? (
                      doctor.coverages.map((coverage) => (
                        <div key={coverage.id}>
                          {coverage.coverages}
                          <button
                            className="remove-coverage-button"
                            onClick={() => handleRemoveCoverage(doctor.id, coverage.id)}
                          >
                           <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </div>
                      ))
                    ) : (
                      "Sin coberturas"
                    )}
                  </td>
                  <td>
                    {!doctor.deleted && (
                      <>
                       <div className="btn-container">
                        <button className="edit-button" onClick={() => openModal(doctor)}>
                          <FontAwesomeIcon icon={faPenToSquare} />Editar
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(doctor.id)}>
                          <FontAwesomeIcon icon={faTrash} />Eliminar 
                        </button>
                        <button
                          className="add-button"
                          onClick={() => openCoverageModal(doctor.id)}>
                         <FontAwesomeIcon icon={faPlus} />Agregar                     
                        </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>       
      </div>
      )}
      <Modal className="formContainerModal" isOpen={showModal} onRequestClose={closeModal} >      
       <form className="formModal" onSubmit={handleSave}>
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
          />
          <div className="btn-container">
          <button className="btn" type="submit">
              Guardar
            </button>
            <button className="btn" type="button" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal className="formContainerModal" isOpen={showCoverageModal} onRequestClose={closeCoverageModal}>

  <h2>Agregar obras sociales al profesional</h2>
  <form className="createForm" onSubmit={(e) => { e.preventDefault(); handleAddCoverage(); }}>
  <select id="coverageSelect" value={selectedCoverage} onChange={handleCoverageChange}>
  <option value="">Seleccionar cobertura</option>
    {coverages.map((coverage) => (
       <option key={coverage.id} value={coverage.id}>
       {coverage.coverages}
     </option>
   ))}
 </select>
 <div className="btn-container">
    <button className="btn" type="submit">
      Guardar
    </button>
    <button className="btn" type="button" onClick={closeCoverageModal}>
      Cancelar
    </button>
  </div>
  </form>
</Modal>
   </div>
</>
  );
};



export default ListProfesionals;
































































































































