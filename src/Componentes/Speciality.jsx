import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Modal from "react-modal";

function ListSpecialities() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    name: "",
  });
  const [newSpeciality, setNewSpeciality] = useState("");

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await fetch("http://localhost:3000/speciality");
        const result = await response.json();
        setSpecialities(result.data);
        setLoading(false);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Hubo un error al traer la lista de especialidades",
          "error"
        );
        setLoading(false);
      }
    };
    fetchSpecialities();
  }, []);

  const handleInputChange = (e) => {
    setNewSpeciality(e.target.value);
  };

  const handleAddSpeciality = async () => {
    try {
      const response = await fetch("http://localhost:3000/speciality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newSpeciality }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      const data = await response.json();
      setSpecialities([...specialities, data.data]);
      Swal.fire({ text: "Especialidad agregada con éxito", icon: "success" });
      setNewSpeciality("");
    } catch (error) {
      Swal.fire(
        "Error!",
        "Hubo un error al intentar agregar la especialidad",
        "error"
      );
    }
  };

  const openModal = (speciality) => {
    setEditData(speciality || { id: 0, name: "" });
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

  const handleEditSpeciality = async (event) => {
    event.preventDefault();
    const { id, name } = editData;
    const updateSpec = { name };
    try {
      const response = await fetch(`http://localhost:3000/speciality/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateSpec),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Algo salió mal");
      }
      const data = await response.json();
      setSpecialities((prevSpecialities) =>
        prevSpecialities.map((spec) => (spec.id === id ? data.data : spec))
      );
      closeModal();
      Swal.fire({ text: "Especialidad actualizada con éxito", icon: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      Swal.fire({
        text: "La especialidad no pudo ser actualizada",
        icon: "warning",
      });
    }
  };

  const handleDelete = async (id) => {
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
        const response = await fetch(`http://localhost:3000/speciality/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Algo salió mal");
        }

        setSpecialities((prevSpecialities) =>
          prevSpecialities.filter((spec) => spec.id !== id)
        );
        Swal.fire({ text: "La especialidad ha sido eliminada.", icon: "success" });
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
          Administrar especialidades
        </h2>
      </div>

      <div>
        <div className="create">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Nombre de la especialidad"
              value={newSpeciality}
              onChange={handleInputChange}
            />
            <button className="add-button" onClick={handleAddSpeciality}>
              Guardar
            </button>
          </div>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Especialidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {specialities.map((speciality) => (
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
                        onClick={() => handleDelete(speciality.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            className="formContainerModal"
            isOpen={showModal}
            onRequestClose={closeModal}
            contentLabel="Editar especialidad"
          >
            <h3>Editar Especialidad</h3>
            <form onSubmit={handleEditSpeciality}>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
              />
              <button className="edit-button" type="submit">Guardar cambios</button>
              {/* <button className="delete-button" type="button" onClick={closeModal}> */}
                Cancelar
              {/* </button> */}
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ListSpecialities;
