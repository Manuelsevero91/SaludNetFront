import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../Styles/ListProfesionals.css";
import NavBar from '../Componentes/NavBar';
import Swal from 'sweetalert2';
import Spinner from "./Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faPenToSquare, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

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
  const [selectedCoverage, setSelectedCoverage] = useState([]);
  const [actualDoctorId, setActualDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const listDoctors = await fetch("http://localhost:3000/doctors");
        const response = await listDoctors.json();
        setDoctors(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
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

    const fetchCoverage = async () => {
      try {
        const response = await fetch("http://localhost:3000/coverage");
        if (!response.ok) {
          throw new Error(
            `Error al obtener las coberturas: ${response.status}`
          );
        }
        const responseData = await response.json();
        setCoverages(responseData.data);
      } catch (error) {
        console.error("Error fetching coverages:", error);
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
    window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "speciality") {
      const selectedSpeciality = specialities.find(
        (speciality) => speciality.id === Number(value)
      );
      setEditData((prevData) => ({
        ...prevData,
        speciality: selectedSpeciality
          ? { id: selectedSpeciality.id, name: selectedSpeciality.name }
          : { id: 0, name: "" },
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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDoctors(doctors.map((doc) => (doc.id === id ? data.data : doc)));
      closeModal();
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar el doctor?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/doctors/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error deleting doctor: ${response.status}`);
        }
        await response.json();
        setDoctors((prevDoctors) => prevDoctors.filter((doc) => doc.id !== id));
        Swal.fire(
          'Eliminado!',
          'El doctor ha sido eliminado.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'Hubo un error al intentar eliminar el doctor.',
          'error'
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
    try {
      const response = await fetch(`http://localhost:3000/doctors/addCoverage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorId: actualDoctorId, coverageId: selectedCoverage }),
      });
      if (!response.ok) {
        throw new Error(`Error adding coverage: ${response.status}`);
      }
      const data = await response.json();
      setDoctors(doctors.map((doc) => (doc.id === actualDoctorId ? data.data : doc)));
      closeCoverageModal();
    } catch (error) {
      console.error("Error adding coverage:", error);
    }
  };

  const handleRemoveCoverage = async (coverageIdToRemove) => {
    try {
      const response = await fetch(`http://localhost:3000/doctors/remove/coverage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorId: actualDoctorId, coverageId: [coverageIdToRemove] }),
      });
      if (!response.ok) {
        throw new Error(`Error removing coverage: ${response.status}`);
      }
      const data = await response.json();
      setDoctors(doctors.map((doc) => (doc.id === actualDoctorId ? data.data : doc)));
      closeCoverageModal();
    } catch (error) {
      console.error("Error removing coverage:", error);
    }
  };

  const handleCoverageChange = (e) => {
  const { value, checked } = e.target;
  const coverageId = Number(value);

  if (checked) {
    setSelectedCoverage([...selectedCoverage, coverageId]);
  } else {
    handleRemoveCoverage(coverageId);
  }
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
        <h2 className="titulo-section">Administrar Profesionales</h2>
      </div>
      <div className="list">
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
              <option key={speciality.id} value={speciality.id}>
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
                <th>Obras Sociales</th>
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
                    {doctor.coverages && doctor.coverages.length > 0 ? (
                      doctor.coverages.map((coverage) => coverage.coverages).join(", ")
                    ) : (
                      "Sin coberturas"
                    )}
                  </td>
                  <td>
                    {!doctor.deleted && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => openModal(doctor)}
                        >
                         <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(doctor.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          className="add-button"
                          onClick={() => openCoverageModal(doctor.id)}
                        >
                          Coberturas
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Modal isOpen={showModal} onRequestClose={closeModal}>
          <form onSubmit={handleSave}>
            <label htmlFor="fullName">Nombre Completo:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={editData.fullName}
              onChange={handleChange}
            />
            <label htmlFor="mail">Correo:</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={editData.mail}
              onChange={handleChange}
            />
            <label htmlFor="phone">Teléfono:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editData.phone}
              onChange={handleChange}
            />
            <label htmlFor="speciality">Especialidad:</label>
            <select
              id="speciality"
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
              id="license"
              name="license"
              value={editData.license}
              onChange={handleChange}
            />
            <button className="Btn" type="submit">
              Guardar
            </button>
            <button className="Btn" type="button" onClick={closeModal}>
              Cancelar
            </button>
          </form>
        </Modal>
        <Modal isOpen={showCoverageModal} onRequestClose={closeCoverageModal}>
  <h2>Gestionar Coberturas</h2>
  <form onSubmit={(e) => { e.preventDefault(); handleAddCoverage(); }}>
    {coverages.map((coverage) => (
      <div key={coverage.id}>
        <label>
          <input
            type="checkbox"
            value={coverage.id}
            checked={selectedCoverage.includes(coverage.id)}
            onChange={handleCoverageChange}
          />
          {coverage.coverages}
        </label>
      </div>
    ))}
    <button className="Btn" type="submit">
      Guardar
    </button>
    <button className="Btn" type="button" onClick={closeCoverageModal}>
      Cancelar
    </button>
  </form>
</Modal>
      </div>
    </>
  );
};

export default ListProfesionals;