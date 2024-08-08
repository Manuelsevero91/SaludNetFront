import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { getToken } from "../Auth/tokenUtils";

function ListData() {
  const [coverages, setCoverages] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalSpe, setShowModalSpe] = useState(false);
  const [showModalCove, setShowModalCove] = useState(false);
  const [editSpeciality, setEditSpeciality] = useState({
    id: 0,
    name: "",
  });
  const [editCoverage, setEditCoverage] = useState({
    id: 0,
    coverages: "",
  });
  const [newCoverage, setNewCoverage] = useState("");
  const [newSpeciality, setNewSpeciality] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
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
        const [coverageResponse, specialityResponse] = await Promise.all([
          fetch("http://localhost:3000/coverage", {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }),
          fetch("http://localhost:3000/speciality", {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }),
        ]);
        if (!coverageResponse.ok || !specialityResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const coverageData = await coverageResponse.json();
        const specialityData = await specialityResponse.json();
        if (Array.isArray(coverageData.data) && Array.isArray(specialityData.data)) {
          setCoverages(coverageData.data);
          setSpecialities(specialityData.data);
        } else {
          throw new Error("Data format is incorrect");
        }
        setLoading(false);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Hubo un error al traer la lista de datos",
          "error"
        );
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e, type) => {
    if (type === "coverage") {
      setNewCoverage(e.target.value);
    } else {
      setNewSpeciality(e.target.value);
    }
  };
  const handleAddData = async (type) => {
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
      const response = await fetch(`http://localhost:3000/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          [type === "coverage" ? "coverages" : "name"]: type === "coverage" ? newCoverage : newSpeciality,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      
      const data = await response.json();
      if (type === "coverage") {
        setCoverages([...coverages, data.data]);
        setNewCoverage("");
      } else {
        setSpecialities([...specialities, data.data]);
        setNewSpeciality("");
      }
      
      Swal.fire({
        text: `${
          type === "coverage" ? "Obra social" : "Especialidad"
        } agregada con éxito`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire(
        "Error!",
        `Hubo un error al intentar agregar la ${
          type === "coverage" ? "obra social" : "especialidad"
        }`,
        "error"
      );
    }
  };

  const openModalSpe = (data) => {
    setEditSpeciality(data || { id: 0, name: "" });
    setShowModalSpe(true);
  };
  const closeModalSpe = () => {
    setShowModalSpe(false);
    setEditSpeciality({
      id: 0,
      name: "",
    });
  };

  const openModalCove = (data) => {
    setEditCoverage(data || { id: 0, coverages: "" });
    setShowModalCove(true);
  };
  const closeModalCove = () => {
    setShowModalCove(false);
    setEditCoverage({
      id: 0,
      coverages: "",
    });
  };

  const handleChangeSpe = (e) => {
    setEditSpeciality({
      ...editSpeciality,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCove = (e) => {
    setEditCoverage({
      ...editCoverage,
      [e.target.name]: e.target.value,
    });
  };
 
  const handleEditCoverage = async (event) => {
    event.preventDefault();
    const { id, coverages } = editCoverage;
    const updateCov = { coverages };
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
      const response = await fetch(`http://localhost:3000/coverage/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateCov),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      const data = await response.json();
      setCoverages((prevCoverages) =>
        prevCoverages.map((cov) => (cov.id === id ? data.data : cov))
    
      );
      closeModalCove();
      Swal.fire({ text: "Obra social actualizada con éxito", icon: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
      
    } catch (error) {
      Swal.fire({
        text: "La obra social no pudo ser actualizada.Verifique estar logueado.",
        icon: "warning",
      });
      
    }
  };

  const handleEditSpeciality = async (event) => {
    event.preventDefault();
    const { id, name } = editSpeciality;
    const updateSpe = { name };
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
      const response = await fetch(`http://localhost:3000/speciality/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateSpe),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      const data = await response.json();
      setSpecialities((prevSpecialities) =>
        prevSpecialities.map((spe) => (spe.id === id ? data.data : spe))
    
      );
      closeModalSpe();
      Swal.fire({ text: "Especialidad actualizada con éxito", icon: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
      
    } catch (error) {
      Swal.fire({
        text: "La especialidad no pudo ser actualizada. Verifique estar logueado.",
        icon: "warning",
      });
      
    }
  };


  const handleDelete = async (id, type) => {
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
      html: `<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/${type}/${id}`, {
          method: "DELETE",
          headers: {
             'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Algo salió mal");
        }
        if (type === "coverage") {
          setCoverages((prevCoverages) =>
            prevCoverages.filter((cov) => cov.id !== id)
          );
        } else {
          setSpecialities((prevSpecialities) =>
            prevSpecialities.filter((spec) => spec.id !== id)
          );
        }
        Swal.fire({
          text: `${
            type === "coverage" ? "La cobertura" : "La especialidad"
          } ha sido eliminada.`,
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          text: `Error al enviar la solicitud: ${error.message}`,
          icon: "error",
        });
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">
          Administrar Obras Sociales y Especialidades
        </h2>
      </div>

      <div className="create">
        <div className="search-bar">
          <div>
            <input
              type="text"
              placeholder="Nombre de la cobertura"
              value={newCoverage}
              onChange={(e) => handleInputChange(e, "coverage")}
            />
            <button
              className="add-button"
              onClick={() => handleAddData("coverage")}
            >
              Guardar
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Nombre de la especialidad"
              value={newSpeciality}
              onChange={(e) => handleInputChange(e, "speciality")}
            />
            <button
              className="add-button"
              onClick={() => handleAddData("speciality")}
            >
              Guardar
            </button>
          </div>
        </div>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Obra social</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(coverages) ? (
                coverages.map((coverage) => (
                  <tr key={coverage.id}>
                    <td>{coverage.coverages}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => openModalCove(coverage)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(coverage.id, "coverage")}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2">No data available</td></tr>
              )}
            </tbody>
          </table>

          <table>
            <thead>
              <tr>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(specialities) ? (
                specialities.map((speciality) => (
                  <tr key={speciality.id}>
                    <td>{speciality.name}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => openModalSpe(speciality)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(speciality.id, "speciality")}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          className="formContainerModal"
          isOpen={showModalCove}
          onRequestClose={closeModalCove}
          contentLabel="Editar Datos"
        >
          <h2>Editar Datos</h2>
          <form onSubmit={handleEditCoverage}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="coverages"
                value={editCoverage.coverages}
                onChange={handleChangeCove}
              />
            </div>
            <div className="btn-container">
              <button className="btn" type="submit">
                Guardar
              </button>
              <button className="btn" type="button" onClick={closeModalCove}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          className="formContainerModal"
          isOpen={showModalSpe}
          onRequestClose={closeModalSpe}
          contentLabel="Editar Datos"
        >
          <h2>Editar Datos</h2>
          <form onSubmit={handleEditSpeciality}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editSpeciality.name}
                onChange={handleChangeSpe}
              />
            </div>
            <div className="btn-container">
              <button className="btn" type="submit">
                Guardar
              </button>
              <button className="btn" type="button" onClick={closeModalSpe}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default ListData;
