/*import React, { useState, useEffect } from "react";
import Spinner from "../Componentes/Spinner";
import Swal from "sweetalert2";
import NavBar from "../Componentes/NavBar";

const Turnos = () => {
  const [patientData, setPatientData] = useState({
    fullName: "",
    dni: "",
    mail: "",
    phone: "",
    address: "",
    birthday: "",
  });

  const [doctorId, setDoctorId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Función para obtener la lista de doctores
  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:3000/doctors");
      if (!response.ok) {
        throw new Error(`Error al traer doctores: ${response.status}`);
      }
      const result = await response.json();
      setDoctors(result.data);
      setTimeout(() => {
        setLoadingDoctors(false);
      }, 2000);
    } catch (error) {
      setLoadingDoctors(false);
      Swal.fire({
        text: "Error al cargar la lista de doctores",
        icon: "error",
      });
    }
  };

  // Función para obtener los horarios de un doctor específico
  const fetchSchedules = async () => {
    if (doctorId) {
      try {
        const response = await fetch(
          `http://localhost:3000/schedules/by-doctor/${doctorId}`
        );
        if (!response.ok) {
          throw new Error(`Error al traer agenda: ${response.status}`);
        }
        const data = await response.json();

        if (data.data.length === 0) {
          Swal.fire({
            text: "El doctor no tiene turnos disponibles",
            icon: "warning",
          });
        } else {
          const sortedSchedules = data.data.sort((a, b) => {
            if (a.day !== b.day) {
              return new Date(a.day) - new Date(b.day); // Ordenamos por fecha
            }
            return a.start_Time.localeCompare(b.start_Time); // Si el día es el mismo, ordenamos por hora de inicio
          });
          setSchedules(sortedSchedules);
        }
      } catch (error) {
        Swal.fire({
          text: "El Profesional no tiene turnos disponibles",
          icon: "error",
        });
      }
    } else {
      setSchedules([]);
    }
  };

  // Función para manejar cambios en los inputs del paciente

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;

    switch (name) {
      case "phone":
        isValid = /^[1-9]\d{0,9}$/.test(value);
        break;
      case "dni":
        isValid = /^\d{0,8}$/.test(value);
        break;
      case "fullName":
        isValid = value.length <= 25;
        break;
      case "address":
        isValid = value.length <= 25;
        break;
      default:
        break;
    }
    if (isValid || value === "") {
      setPatientData({
        ...patientData,
        [name]: value,
      });
    }
  };

  // Función para manejar el cambio de doctor seleccionado
  const handleDoctorChange = (e) => {
    setDoctorId(e.target.value);
  };

  // Función para manejar el cambio de horario seleccionado
  const handleScheduleChange = (e) => {
    setScheduleId(e.target.value);
  };

  // Función para enviar la reserva del turno
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (patientData.dni.length < 7 || patientData.dni.length > 8) {
      Swal.fire({ text: "El DNI debe tener 7 u 8 dígitos", icon: "error" });
      return;
    }

    if (patientData.phone.length !== 10) {
      Swal.fire({ text: "El teléfono debe tener 10 dígitos", icon: "error" });
      return;
    }

    try {
      let patientId;

      // Buscar paciente por DNI
      const patientResponse = await fetch(
        `http://localhost:3000/patients/by-dni/${patientData.dni}`
      );

      if (patientResponse.ok) {
        const patientDataResponse = await patientResponse.json();
        if (patientDataResponse.data) {
          // Si el paciente ya está registrado, obtén su ID
          patientId = patientDataResponse.data.id;
        }
      } else if (patientResponse.status === 404) {
        // Si el paciente no existe, crear uno nuevo
        const newPatientResponse = await fetch(
          "http://localhost:3000/patients",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(patientData),
          }
        );

        if (newPatientResponse.ok) {
          const newPatientData = await newPatientResponse.json();
          patientId = newPatientData.data.id;
        } else {
          throw new Error(
            `Error al crear paciente: ${newPatientResponse.status}`
          );
        }
      } else {
        throw new Error(`Error al buscar paciente: ${patientResponse.status}`);
      }

      // Reservar turno
      const shiffResponse = await fetch("http://localhost:3000/shiff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idSchedule: scheduleId,
          idPatient: patientId,
        }),
      });

      if (!shiffResponse.ok) {
        throw new Error(await shiffResponse.text());
      }

      Swal.fire({ text: "Turno reservado con éxito", icon: "success" }).then(
        () => {
          window.location.reload();
        }

      );
    } catch (error) {
      if (error.message.includes("El paciente con DNI")) {
        const errorMessage = JSON.parse(error.message);
        Swal.fire({
          text: `${errorMessage.message}. Ante cualquier duda, por favor llame al teléfono "2281325016".`,
          icon: "error",
          timer: 8000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          text: error.message || "Hubo un error al reservar el turno",
          icon: "error",
        }).then(() => {
          window.location.reload();
        });
      }
    }
  };

  // Efecto para cargar la lista de doctores al montar el componente
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Efecto para cargar los horarios cuando se selecciona un doctor
  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Reserva de turnos</h2>
      </div>

      <Spinner loading={loadingDoctors} />

      <div className="formContainer">
        <form className="createForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            value={patientData.fullName}
            onChange={handleInputChange}
            placeholder="NOMBRE Y APELLIDO"
            required
          />
          <input
            type="text"
            name="dni"
            value={patientData.dni}
            onChange={handleInputChange}
            placeholder="DNI (sin puntos)"
            required
          />
          <input
            type="email"
            name="mail"
            value={patientData.mail}
            onChange={handleInputChange}
            placeholder="MAIL"
            required
          />
          <input
            type="text"
            name="phone"
            value={patientData.phone}
            onChange={handleInputChange}
            placeholder="CELULAR (Sin el '0' ni '-')"
            required
          />
          <input
            type="text"
            name="address"
            value={patientData.address}
            onChange={handleInputChange}
            placeholder="DOMICILIO"
            required
          />
          <input
            type="text"
            name="birthday"
            value={patientData.birthday}
            onChange={handleInputChange}
            placeholder="FECHA DE NACIMIENTO (AAAA-MM-DD)"
            required
          />
          <select onChange={handleDoctorChange} required>
            <option value="">Seleccione un doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.fullName} - {doctor.speciality.name}
              </option>
            ))}
          </select>

          <select onChange={handleScheduleChange} required>
            <option value="">Seleccione un horario</option>
            {schedules.map((schedule) => (
              <option key={schedule.idSchedule} value={schedule.idSchedule}>
                {schedule.day} - {schedule.start_Time}
              </option>
            ))}
          </select>

          <button className="btn" type="submit">
            Reservar Turno
          </button>
        </form>
      </div>
    </>
  );
};

export default Turnos;*/
import React, { useState, useEffect, useRef } from "react";
import Spinner from "../Componentes/Spinner";
import Swal from "sweetalert2";
import NavBar from "../Componentes/NavBar";
import ReCAPTCHA from "react-google-recaptcha";
import { ErrorMessage, Field, Formik, Form } from 'formik';
import * as Yup from "yup";

const isValidDate = (dateString) => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date && (date.getMonth() + 1) === month && date.getDate() === day;
};

const Turnos = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [schedulesId, setScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [captchaValid, setCaptchaValid] = useState(null);

  const captcha = useRef(null);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .matches(/^[a-zA-ZÀ-ÿ\s]{1,40}$/, "El nombre solo puede contener letras y espacios")
      .max(25, "El nombre no puede tener más de 25 caracteres")
      .required("Por favor ingresa un nombre"),
    dni: Yup.string()
      .matches(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos")
      .required("Por favor ingresa un DNI"),
    mail: Yup.string()
      .email("El correo no es válido")
      .required("Por favor ingresa un correo electrónico"),
    phone: Yup.string()
      .matches(/^[1-9]\d{9}$/, "El teléfono debe tener 10 dígitos")
      .required("Por favor ingresa un teléfono"),
    address: Yup.string()
      .max(25, "La dirección no puede tener más de 25 caracteres")
      .required("Por favor ingresa una dirección"),
    birthday: Yup.string()
      .required("Por favor ingresa una fecha de nacimiento")
      .test("isValidDate", "La fecha no es válida", value => isValidDate(value)),
    doctorId: Yup.string().required("Por favor selecciona un doctor"),
    scheduleId: Yup.string().required("Por favor selecciona un horario"),
  });

  const onChange = () => {
    const value = captcha.current.getValue();
    setCaptchaValid(Boolean(value));
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:3000/doctors");
      if (!response.ok) {
        throw new Error(`Error al traer doctores: ${response.status}`);
      }
      const result = await response.json();
      setDoctors(result.data);
      setTimeout(() => {
        setLoadingDoctors(false);
      }, 2000);
    } catch (error) {
      setLoadingDoctors(false);
      Swal.fire({
        text: "Error al cargar la lista de doctores",
        icon: "error",
      });
    }
  };

  const fetchSchedules = async () => {
    if (doctorId) {
      try {
        const response = await fetch(
          `http://localhost:3000/schedules/by-doctor/${doctorId}`
        );
        if (!response.ok) {
          throw new Error(`Error al traer agenda: ${response.status}`);
        }
        const data = await response.json();

        if (data.data.length === 0) {
          Swal.fire({
            text: "El doctor no tiene turnos disponibles",
            icon: "warning",
          });
        } else {
          const sortedSchedules = data.data.sort((a, b) => {
            if (a.day !== b.day) {
              return new Date(a.day) - new Date(b.day);
            }
            return a.start_Time.localeCompare(b.start_Time);
          });
          setSchedules(sortedSchedules);
        }
      } catch (error) {
        Swal.fire({
          text: "El Profesional no tiene turnos disponibles",
          icon: "error",
        });
      }
    } else {
      setSchedules([]);
    }
  };

  const handleDoctorChange = (e) => {
    setDoctorId(e.target.value);
  };

  const handleScheduleChange = (e) => {
    setScheduleId(e.target.value);
  };

  const handleInputChange = (e, setFieldValue, setFieldError) => {
    const { name, value } = e.target;
  
    let isValid = true;
    let errorMessage = "";
  
    switch (name) {
      case "phone":
        if (!/^[1-9]\d{0,9}$/.test(value)) {
          isValid = false;
          errorMessage = "El teléfono debe tener 10 dígitos";
        }
        break;
      case "dni":
        if (!/^\d{0,8}$/.test(value)) {
          isValid = false;
          errorMessage = "El DNI debe tener entre 7 y 8 dígitos";
        }
        break;
      case "fullName":
        if (value.length > 25) {
          isValid = false;
          errorMessage = "El nombre no puede tener más de 25 caracteres";
        }
        break;
      case "address":
        if (value.length > 25) {
          isValid = false;
          errorMessage = "La dirección no puede tener más de 25 caracteres";
        }
        break;
      default:
        break;
    }
  
    if (!isValid) {
      Swal.fire({
        text: errorMessage,
        icon: "error",
      });
    }
  
    setFieldValue(name, value);
    if (!isValid) {
      setFieldError(name, errorMessage);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!captchaValid) {
      Swal.fire({ text: "Por favor completa el reCAPTCHA", icon: "error" });
      setSubmitting(false);
      return;
    }

    try {
      let patientId;

      const patientResponse = await fetch(
        `http://localhost:3000/patients/by-dni/${values.dni}`
      );

      if (patientResponse.ok) {
        const patientDataResponse = await patientResponse.json();
        if (patientDataResponse.data) {
          patientId = patientDataResponse.data.id;
        }
      } else if (patientResponse.status === 404) {
        const newPatientResponse = await fetch(
          "http://localhost:3000/patients",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (newPatientResponse.ok) {
          const newPatientData = await newPatientResponse.json();
          patientId = newPatientData.data.id;
        } else {
          throw new Error(
            `Error al crear paciente: ${newPatientResponse.status}`
          );
        }
      } else {
        throw new Error(`Error al buscar paciente: ${patientResponse.status}`);
      }

      const shiffResponse = await fetch("http://localhost:3000/shiff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idSchedule: values.scheduleId,
          idPatient: patientId,
        }),
      });

      if (!shiffResponse.ok) {
        throw new Error(await shiffResponse.text());
      }

      Swal.fire({ text: "Turno reservado con éxito", icon: "success" }).then(
        () => {
          window.location.reload();
        }
      );
    } catch (error) {
      if (error.message.includes("El paciente con DNI")) {
        const errorMessage = JSON.parse(error.message);
        Swal.fire({
          text: `${errorMessage.message}. Ante cualquier duda, por favor llame al teléfono "2281325016".`,
          icon: "error",
          timer: 8000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          text: error.message || "Hubo un error al reservar el turno",
          icon: "error",
        }).then(() => {
          window.location.reload();
        });
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  return (
    <>
      <NavBar showLinks={false} />
      <div className="barra-superior">
        <h2 className="titulo-section">Reserva de turnos</h2>
      </div>

      <Spinner loading={loadingDoctors} />
      <Formik
        initialValues={{
          fullName: "",
          dni: "",
          mail: "",
          phone: "",
          address: "",
          birthday: "",
          doctorId: "",
          scheduleId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors, setFieldValue, setFieldError }) => (
          <div className="formContainer">
            <Form className="createForm">
              <Field
                type="text"
                name="fullName"
                className={touched.fullName && errors.fullName ? 'input-error' : ''}
                placeholder="NOMBRE Y APELLIDO"
                onChange={(e) => handleInputChange(e, setFieldValue, setFieldError)}
              />
              <ErrorMessage name="fullName" component="div" className="error" />

              <Field
                type="text"
                name="dni"
                className={touched.dni && errors.dni ? 'input-error' : ''}
                placeholder="DNI (sin puntos)"
                onChange={(e) => handleInputChange(e, setFieldValue, setFieldError)}
              />
              <ErrorMessage name="dni" component="div" className="error" />

              <Field
                type="email"
                name="mail"
                className={touched.mail && errors.mail ? 'input-error' : ''}
                placeholder="MAIL"
                onChange={(e) => setFieldValue('mail', e.target.value)}
              />
              <ErrorMessage name="mail" component="div" className="error" />

              <Field
                type="text"
                name="phone"
                className={touched.phone && errors.phone ? 'input-error' : ''}
                placeholder="CELULAR (Sin el '0' ni '-')"
                onChange={(e) => handleInputChange(e, setFieldValue, setFieldError)}
              />
              <ErrorMessage name="phone" component="div" className="error" />

              <Field
                type="text"
                name="address"
                className={touched.address && errors.address ? 'input-error' : ''}
                placeholder="DOMICILIO"
                onChange={(e) => handleInputChange(e, setFieldValue, setFieldError)}
              />
              <ErrorMessage name="address" component="div" className="error" />

              <Field
                type="text"
                name="birthday"
                className={touched.birthday && errors.birthday ? 'input-error' : ''}
                placeholder="FECHA DE NACIMIENTO(AAAA-MM-DD)"
                onChange={(e) => setFieldValue('birthday', e.target.value)}
              />
              <ErrorMessage name="birthday" component="div" className="error" />

              <Field
                as="select"
                name="doctorId"
                nChange={(e) => {
                  handleDoctorChange(e);
                  setFieldValue('doctorId', e.target.value);
                }}
                className={touched.doctorId && errors.doctorId ? 'input-error' : ''}
                required
              >
                <option value="">SELECCIONAR PROFESIONAL</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="doctorId" component="div" className="error" />

              <Field
                as="select"
                name="scheduleId"
                onChange={(e) => {
                  handleScheduleChange(e);
                  setFieldValue('scheduleId', e.target.value);
                }}
                className={touched.scheduleId && errors.scheduleId ? 'input-error' : ''}
                required
              >
                <option value="">SELECCIONAR HORARIO</option>
                {schedules.map((schedule) => (
              <option key={schedule.idSchedule} value={schedule.idSchedule}>
                {schedule.day} - {schedule.start_Time}
              </option>
                ))}
              </Field>
              <ErrorMessage name="scheduleId" component="div" className="error" />

              <div className="captcha-container">
                <ReCAPTCHA
                  ref={captcha}
                  sitekey="6Ld7vxQqAAAAAIiI-ur0kUTV-RSXzdI55lTr09Wi"
                  onChange={onChange}
                  className="captcha"
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-crear">
                {isSubmitting ? "Enviando..." : "Reservar Turno"}
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Turnos;
