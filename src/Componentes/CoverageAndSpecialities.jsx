import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Modal from "react-modal";

function ListData() {
  const [coverages, setCoverages] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    name: "",
  });
  const [newCoverage, setNewCoverage] = useState("");
  const [newSpeciality, setNewSpeciality] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coverageResponse, specialityResponse] = await Promise.all([
          fetch("http://localhost:3000/coverage"),
          fetch("http://localhost:3000/speciality"),
        ]);

        if (!coverageResponse.ok || !specialityResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const coverageData = await coverageResponse.json();
        const specialityData = await specialityResponse.json();

        console.log("Coverage Data:", coverageData);
        console.log("Speciality Data:", specialityData);

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
    try {
      const response = await fetch(`http://localhost:3000/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: type === "coverage" ? newCoverage : newSpeciality,
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

  const openModal = (data) => {
    setEditData(data || { id: 0, name: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData({
      id: 0,
      name: "",
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditData = async (event) => {
    event.preventDefault();
    const { id, name } = editData;
    const updateData = { name };
    const type = coverages.some((cov) => cov.id === id)
      ? "coverage"
      : "speciality";
    try {
      const response = await fetch(`http://localhost:3000/${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      const data = await response.json();
      if (type === "coverage") {
        setCoverages((prevCoverages) =>
          prevCoverages.map((cov) => (cov.id === id ? data.data : cov))
        );
      } else {
        setSpecialities((prevSpecialities) =>
          prevSpecialities.map((spec) => (spec.id === id ? data.data : spec))
        );
      }
      closeModal();
      Swal.fire({
        text: `${
          type === "coverage" ? "Obra social" : "Especialidad"
        } actualizada con éxito`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        text: `${
          type === "coverage" ? "La obra social" : "La especialidad"
        } no pudo ser actualizada`,
        icon: "warning",
      });
    }
  };

  const handleDelete = async (id, type) => {
    const result = await Swal.fire({
      html: `<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/${type}/${id}`, {
          method: "DELETE",
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
                    <td>{coverage.name}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => openModal(coverage)}
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
                        onClick={() => openModal(speciality)}
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
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Editar Datos"
        >
          <h2>Editar Datos</h2>
          <form onSubmit={handleEditData}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editData.name}
                onChange={handleChange}
              />
            </div>
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
      </div>
    </>
  );
}

export default ListData;
