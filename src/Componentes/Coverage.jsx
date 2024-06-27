import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faPenToSquare, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

import "../Styles/Informacion.css";

function ListCoverage() {
  const [coverages, setCoverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    coverages: "",
  });
  const [newCoverage, setNewCoverage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredCoverages, setFilteredCoverages] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const listCoverage = await fetch("http://localhost:3000/coverage");
        const result = await listCoverage.json();
        setCoverages(result.data);
        setFilteredCoverages(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCoverage();
  }, []);

  const handleInputChange = (e) => {
    setNewCoverage(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchName(e.target.value);
    filterCoverages(e.target.value);
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
      setFilteredCoverages([...coverages, data.data]);
      Swal.fire({ text: "Cobertura agregada con éxito", icon: 'success' });
      setNewCoverage("");
    } catch (error) {
      Swal.fire({ text: "Error al agregar la cobertura", icon: 'error' });
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
      setFilteredCoverages((prevCoverages) =>
        prevCoverages.map((cov) => (cov.id === id ? data.data : cov))
      );

      closeModal();
      Swal.fire({ text: "Se ha editado correctamente", icon: 'success' });
    } catch (error) {
      Swal.fire({ text: "Error al enviar la solicitud", icon: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás segura que desea eliminar la obra social?',
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
        setFilteredCoverages((prevCoverages) =>
          prevCoverages.filter((cov) => cov.id !== id)
        );

        Swal.fire({ text: "La cobertura ha sido eliminada.", icon: "success" });
      } catch (error) {
        Swal.fire({ text: "Error al enviar la solicitud", icon: 'error' });
      }
    }
  };

  const sortCoverages = () => {
    const sortedCoverages = [...filteredCoverages].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.coverages.localeCompare(b.coverages);
      } else {
        return b.coverages.localeCompare(a.coverages);
      }
    });
    setFilteredCoverages(sortedCoverages);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filterCoverages = (searchTerm) => {
    if (searchTerm === "") {
      setFilteredCoverages(coverages);
    } else {
      const filtered = coverages.filter((coverage) =>
        coverage.coverages.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoverages(filtered);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Obras sociales</h1>
      <div className="coverage">
        <div>
          <input
            type="text"
            placeholder="Nombre de la cobertura"
            value={newCoverage}
            onChange={handleInputChange}
          />
          <button className="save" onClick={handleAddCoverage}>
            Guardar
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar cobertura por nombre"
            value={searchName}
            onChange={handleSearchInputChange}
          />
          <button className="search">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Obra social
                <button onClick={sortCoverages}>
                  <FontAwesomeIcon icon={faSort} />
                </button>
              </th>
              <th>Controles</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoverages.map((coverage) => (
              <tr key={coverage.id}>
                <td>{coverage.coverages}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => openModal(coverage)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(coverage.id)}
                  >
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
          contentLabel="Editar"
          className="modal"
          overlayClassName="overlay"
        >
          <form onSubmit={handleEditCoverage}>
            <label>Nombre de la nueva cobertura:</label>
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
  );
}

export default ListCoverage;
