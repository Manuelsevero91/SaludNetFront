import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Styles/CreateSchedule.css';

const CreateSchedule = ({ doctorId, day }) => {
    const [turnos, setTurnos] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [currentDoctorId, setCurrentDoctorId] = useState(doctorId || '');
    const intervalInMinutes = 30;

    const createScheduleForMonth = async () => {
        const turnos = [];
        const fecha = new Date(day);

        while (fecha.getMonth() === new Date(day).getMonth()) {
            if (fecha.getDay() !== 0 && fecha.getDay() !== 4) {
                for (let hora = 9; hora < 17; hora += intervalInMinutes / 30) {
                    const startTime = new Date(fecha);
                    startTime.setHours(hora, 0, 0);
                    const endTime = new Date(startTime);
                    endTime.setMinutes(startTime.getMinutes() + intervalInMinutes);

                    turnos.push({
                        day: fecha.toISOString().split('T')[0],
                        idDoctor: currentDoctorId,
                        start_Time: startTime.toTimeString().split(' ')[0],
                        end_Time: endTime.toTimeString().split(' ')[0],
                        available: true,
                        interval: intervalInMinutes.toString()
                    });
                }
            }
            fecha.setDate(fecha.getDate() + 1);
        }

        try {
            const response = await fetch('http://localhost:3000/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ schedules: turnos }),
            });
            console.log('Turnos creados', response);
        } catch (error) {
            console.error('Error creando turnos', error);
        }
    };

    useEffect(() => {
        createScheduleForMonth();
    }, [currentDoctorId, day]);

    const handleCreateSchedule = (event) => {
        event.preventDefault();
        createScheduleForMonth();
    };

    const handleDoctorIdChange = (event) => {
        setCurrentDoctorId(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const turno = turnos.find(t => t.day === date.toISOString().split('T')[0]);
            if (turno) {
                return <div>{turno.start_Time}</div>;
            }
        }
    };

    return (
        <div className="create-schedule-container">
            <h2 className="create-schedule-title">Crear Agenda de Turnos</h2>
            <form className="create-schedule-form" onSubmit={handleCreateSchedule}>
                <label htmlFor="doctorId">ID del Doctor:</label>
                <input
                    type="text"
                    id="doctorId"
                    name="doctorId"
                    value={currentDoctorId}
                    onChange={handleDoctorIdChange}
                />
                <label htmlFor="startDate">Fecha de Inicio:</label>
                <Calendar
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    minDate={new Date()}
                />
                <button className="create-schedule-button" type="submit">Crear Agenda</button>
            </form>
            <div className="calendar-container">
                <Calendar
                    tileContent={tileContent}
                />
            </div>
        </div>
    );
};

export default CreateSchedule;
