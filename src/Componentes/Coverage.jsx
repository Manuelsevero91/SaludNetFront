import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import NavBar from "../Componentes/NavBar";
// import "../Styles/Coverage.css";
function ListCoverage() {
  const [coverages, setCoverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    coverages: "",
  });
  const [newCoverage, setNewCoverage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const listCoverage = await fetch("http://localhost:3000/coverage");
        const result = await listCoverage.json();
        setCoverages(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coverages:", error);
        setLoading(false);
      }
    };
    fetchCoverage();
  }, []);
  const handleInputChange = (e) => {
    setNewCoverage(e.target.value);
  };
  const handleAddCoverage = async () => {
    try {
      const response = await fetch("http://localhost:3000/coverage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverages: newCoverage }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      const data = await response.json();
      setCoverages([...coverages, data.data]);
      setSuccess("Cobertura agregada exitosamente");
      setError("");
      setNewCoverage("");
    } catch (error) {
     
      setError("Error al agregar la cobertura: " + error.message);
      setSuccess("");
    }
  };
  const openModal = (coverage) => {
    setEditData(coverage || { id: "", coverages: "" });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditData({
      id: "",
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
    try {
      const response = await fetch(`http://localhost:3000/coverage/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateCov),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      const data = await response.json();
      setCoverages((prevCoverages) =>
        prevCoverages.map((cov) => (cov.id === id ? data.data : cov))
      );
      closeModal();
      setSuccess("Registro exitoso");
      setError("");
    } catch (error) {
      console.error("Error updating coverage:", error);
      setError("Error al enviar la solicitud: " + error.message);
      setSuccess("");
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/coverage/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      setCoverages((prevCoverages) =>
        prevCoverages.filter((cov) => cov.id !== id)
      );
      setSuccess("Eliminación exitosa");
      setError("");
    } catch (error) {
      console.error("Error deleting coverage:", error);
      setError("Error al enviar la solicitud de eliminación: " + error.message);
      setSuccess("");
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <NavBar showLinks={true} />        
        <div className="barra-superior">
          <h2 className="titulo-section">Administrar agenda: Seleccionar Obras Sociales</h2>
        </div>
        <div className="list">  
    <div>
    {error && <div className="error-message" >{error}</div>}
    {success && <div className="succes-message">{success}</div>}
     
      <div className="create">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Nombre de la cobertura"
            value={newCoverage}
            onChange={handleInputChange}
          />
          <button className="btn" onClick={handleAddCoverage}>
            Guardar
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Obra social</th>
              <th>Controles</th>
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
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(coverage.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Edit "
          className="modal"
          overlayClassName="overlay"
        >
          <form onSubmit={handleEditCoverage}>
            <label>Nombre de la cobertura:</label>
            <input
              type="text"
              name="coverages"
              value={editData.coverages}
              onChange={handleChange}
            />
            <button type="submit">Guardar</button>
            <button type="button" onClick={closeModal}>
              Cancelar
            </button>
          </form>
        </Modal>
      </div>
    </div>
    </div>
    </>
  );
}
export default ListCoverage;