import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { getToken } from "../Auth/tokenUtils";

function ListCoverage() {
  const [coverages, setCoverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    coverages: "",
  });
  const [newCoverage, setNewCoverage] = useState("");
  
  useEffect(() => {
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
        const listCoverage = await fetch("http://localhost:3000/coverage", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        const result = await listCoverage.json();
        setCoverages(result.data);
        setLoading(false);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Hubo un error al traer la lista de obras sociales. Verifique estar logueado.",
          "error"
        );
        setLoading(false);
      }
    };
    fetchCoverage();
  }, []);

  const handleInputChange = (e) => {
    setNewCoverage(e.target.value);
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
      const response = await fetch("http://localhost:3000/coverage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coverages: newCoverage }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      const data = await response.json();
      setCoverages([...coverages, data.data]);
      Swal.fire({ text: "Obra social agregada con éxito", icon: "success" });
      setNewCoverage("");
    } catch (error) {
      Swal.fire(
        "Error!",
        "Hubo un error al intentar agregar la obra social.Verifique estar logueado.",
        "error"
      );
    }
  };

  const openModal = (coverage) => {
    setEditData(coverage || { id: 0, coverages: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData({
      id: 0,
      coverages: "",
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditCoverage = async (event) => {
    event.preventDefault();
    const { id, coverages } = editData;
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
      closeModal();
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
        const response = await fetch(`http://localhost:3000/coverage/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Algo salió mal");
        }
  
        setCoverages((prevCoverages) =>
          prevCoverages.filter((cov) => cov.id !== id)
        );
        Swal.fire({ text: "La cobertura ha sido eliminada.", icon: "success" });
      } catch (error) {
        Swal.fire({ text: `Error al enviar la solicitud: ${error.message}`, icon: 'error' });
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
          Administrar obras sociales
        </h2>
      </div>

      <div>
        <div className="create">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Nombre de la cobertura"
              value={newCoverage}
              onChange={handleInputChange}
            />
            <button className="add-button" onClick={handleAddCoverage}>
              Guardar
            </button>
          </div>
          <div className="tableContainer">
          <div className="tableContainerCoverage">
            <table>
              <thead>
                <tr>
                  <th>Obra social</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {coverages.map((coverage) => (
                  <tr key={coverage.id}>
                    <td>{coverage.coverages}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => openModal(coverage)}
                      >
                        <FontAwesomeIcon icon={faEdit} />Editar
                      
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(coverage.id)}
                      >
                         <FontAwesomeIcon icon={faTrash} />Eliminar
                        
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          <Modal
            className="formContainerModal"
            isOpen={showModal}
            onRequestClose={closeModal}
            contentLabel="Editar obra social"
          >
             <h3>Editar Obra Social</h3>
            <form onSubmit={handleEditCoverage}>
              <input
                type="text"
                name="coverages"
                value={editData.coverages}
                onChange={handleChange}
              />
              <button className="edit-button"  type="submit">Guardar cambios</button>
              <button className="delete-button" type="button" onClick={closeModal}>
                Cancelar
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}
export default ListCoverage;



