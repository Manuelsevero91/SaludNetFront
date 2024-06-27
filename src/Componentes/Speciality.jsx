import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import NavBar from "../Componentes/NavBar";
import "../Styles/Informacion.css";
import Swal from 'sweetalert2';

function ListSpeciality() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    name: "",
  });
  const [newSpeciality, setNewSpeciality] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await fetch("http://localhost:3000/speciality");
        const result = await response.json();
        setSpecialities(result.data);
        setLoading(false);
      } catch (error) {
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
        body: JSON.stringify({ especialidad: newSpeciality }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      } else {
        const data = await response.json();
        setSpecialities([...specialities, data.data]);
        Swal.fire({ text: "Especialidad agregada con éxito", icon: 'success' });
        setNewSpeciality("");
      }
    } catch (error) {
      Swal.fire({ text: "Error al agregar la especialidad", icon: 'error' });
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
    const updatedSpeciality = { name };
    try {
      const response = await fetch(`http://localhost:3000/speciality/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSpeciality),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      setSpecialities((prevSpecialities) =>
        prevSpecialities.map((spe) => (spe.id === id ? data.data : spe))
      );

      closeModal();
      Swal.fire({ text: "Se ha editado correctamente", icon: 'success' });
    } catch (error) {
      Swal.fire({ text: "Error al enviar la solicitud", icon: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás segura que desea eliminar la especialidad?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/speciality/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }
        setSpecialities((prevSpecialities) =>
          prevSpecialities.filter((spe) => spe.id !== id)
        );
        Swal.fire({ text: "La especialidad ha sido eliminada.", icon: "success" });
      } catch (error) {
        Swal.fire({ text: "Error al enviar la solicitud", icon: 'error' });
      }
    }
  };

  const sortSpeciality = () => {
    const sortedSpecialities = [...specialities].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.specialities.localeCompare(b.specialities);
      } else {
        return b.specialities.localeCompare(a.specialities);
      }
    });
    setSpecialities(sortedSpecialities);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Especialidades</h1>
      <div className="speciality">
        <div>
          <input
            type="text"
            placeholder="Nombre de la especialidad"
            value={newSpeciality}
            onChange={handleInputChange}
          />
          <button className="save" onClick={handleAddSpeciality}>
            Guardar
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Especialidad
              <button onClick={sortSpeciality}>
              <FontAwesomeIcon icon={faSort} /> 
        </button>
              </th>
              <th>Controles</th>
            </tr>
          </thead>
          <tbody>
            {specialities.map((speciality) => (
              <tr key={speciality.id}>
                <td>{speciality.name}</td>
                <td>
                  <button className="edit-button" onClick={() => openModal(speciality)}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(speciality.id)}>
                  <FontAwesomeIcon icon={faTrash} />
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
          <form onSubmit={handleEditSpeciality}>
            <label>Nombre de la nueva especialidad:</label>
            <input
              type="text"
              name="name"
              value={editData.name}
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
  );
}

export default ListSpeciality;
