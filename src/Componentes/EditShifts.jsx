import React, { useState, useEffect } from 'react';
import Spinner from '../Componentes/Spinner';
import Swal from 'sweetalert2';
import NavBar from '../Componentes/NavBar';

const ShiffList = () => {
  const [shiffs, setShiffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShiffs, setSelectedShiffs] = useState([]);

  useEffect(() => {
    const fetchShiffs = async () => {
      try {
        const response = await fetch('http://localhost:3000/shiff');

        if (!response.ok) {
          throw new Error(`Error fetching shiffs: ${response.status}`);
        }
        const result = await response.json();
        console.log(result.data)
        setShiffs(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire({ text: 'Hubo un error al traer los turnos', icon: 'error' });
      }
    };
    fetchShiffs();
  }, []);

  const handleSelectShiff = (id) => {
    setSelectedShiffs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((shiffId) => shiffId !== id)
        : [...prevSelected, id]
    );
  };

  const handleConfirmShiffs = async () => {
    try {
      await Promise.all(selectedShiffs.map(async (id) => {
        await fetch(`http://localhost:3000/shiff/confirm/${id}`, {
          method: 'PUT',
        });
      }));
      Swal.fire({ text: 'Turnos confirmados', icon: 'success' });
    } catch (error) {
      Swal.fire({ text: 'Hubo un error al confirmar los turnos', icon: 'error' });
    }
  };

  const handleDeleteShiffs = async (id) => {
    try {
      const shiff = shiffs.find((shiff) => shiff.id === id);
      await fetch(`http://localhost:3000/shiff/${id}`, {
        method: 'DELETE',
      });
      await fetch(`http://localhost:3000/schedules/${shiff.Schedules.idSchedule}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: true }),
      });
      setShiffs((prevShiffs) => prevShiffs.filter((shiff) => !selectedShiffs.includes(shiff.id)));
      setSelectedShiffs([]);
      console.log(setShiffs)
      Swal.fire({ text: 'Turnos eliminados con éxito', icon: 'success' });
    } catch (error) {
      Swal.fire({ text: 'Hubo un error al eliminar los turnos', icon: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
    
  };

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Lista de turnos reservados</h2>
      </div>

      <Spinner loading={loading} />

      {!loading && (
        <div >
          {shiffs.length > 0 ? (
            <>
               <div className="tableContainer">
              <table>
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Hora</th>
                    <th>Doctor</th>
                    <th>Paciente</th>
                    <th>Seleccionar</th>                    
                  </tr>
                </thead>
                <tbody>
                  {shiffs.map((shiff) => (
                    <tr key={shiff.id}>
                      <td>{formatDate(shiff.Schedules?.day) || 'N/A'}</td>
                      <td>{shiff.Schedules?.start_Time || 'N/A'}</td>
                      <td>{shiff.Schedules?.idDoctors?.fullName || 'N/A'}</td>
                      <td>{shiff.Patient?.fullName || 'N/A'}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedShiffs.includes(shiff.id)}
                          onChange={() => handleSelectShiff(shiff.id)}
                        />
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="buttonContainer">
                <button className="btn" onClick={handleConfirmShiffs}>Confirmar Seleccionados</button>
                <button className="btn" onClick={handleDeleteShiffs}>Eliminar Seleccionados</button>
              </div>
              </div>
            </>
          ) : (
            <p>No hay turnos reservados.</p>
          )}
        </div>
      )}
      
    </>
  );
};

export default ShiffList;



