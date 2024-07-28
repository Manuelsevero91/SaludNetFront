import React, { useState, useEffect } from "react";
import NavBar from "../Componentes/NavBar";
import Swal from "sweetalert2";
import { getToken } from "../Auth/tokenUtils";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";

function FormProfesionals() {
  const [specialities, setSpecialities] = useState([]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .matches(
        /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
        "El nombre solo puede contener letras y espacios"
      )
      .max(30, "El nombre no puede tener más de 30 caracteres")
      .required("Por favor ingresa un nombre"),
    mail: Yup.string()
      .email("El correo no es válido")
      .required("Por favor ingresa un correo electrónico"),
    phone: Yup.string()
      .matches(/^[1-9]\d{9}$/, "El teléfono debe tener 10 dígitos")
      .required("Por favor ingresa un teléfono"),
    license: Yup.string()
      .max(8, 'La Licencia debe comenzar por "MP" o "MN" seguido de 6 dígitos')
      .required("Por favor ingresa una MP|MN con formato correcto"),
    speciality: Yup.string().required("Por favor seleccione una especialidad"),
  });
  useEffect(() => {
    const fetchSpecialities = async () => {
      const token = getToken();

      if (!token) {
        Swal.fire({
          icon: "error",
          html: "<span>Error</span>",
          text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
        });
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/speciality", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            "Error al obtener las especialidades: " + response.status
          );
        }
        const responseData = await response.json();
        setSpecialities(responseData.data);
      } catch (error) {
        Swal.fire({
          text: "No se pudo obtener la lista de especialidades",
          icon: "error",
        });
      }
    };
    fetchSpecialities();
  }, []);

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
      case "fullName":
        if (value.length > 30) {
          isValid = false;
          errorMessage = "El nombre no puede tener más de 30 caracteres";
        }
        break;

      case "license":
        if (value.length > 8) {
          isValid = false;
          errorMessage =
            'La Licencia debe comenzar por "MP | MN" y luego incorporar 6 digitos 023548';
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "error",
        html: "<span>Error</span>",
        text: "No se encontró el token de autenticación. Por favor, inicie sesión.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        Swal.fire({
          html: "<span class='custom-swal-title'>El profesional ha sido agregado con éxito,</span>",
          icon: "success",
        });

        resetForm();
      } else {
        Swal.fire({
          text: "Error en el registro del profesional. Verifique si está logueado.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        text: "Error en el registro del profesional",
        icon: "error",
      });
    }

    setSubmitting(false);
  };

  return (
    <>
      <NavBar showLinks={true} />
      <div className="barra-superior">
        <h2 className="titulo-section">Administrar Profesionales: registrar</h2>
      </div>
      <Formik
        initialValues={{
          fullName: "",
          mail: "",
          phone: "",
          license: "",
          speciality: "",
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
                className={
                  touched.fullName && errors.fullName ? "input-error" : ""
                }
                placeholder="NOMBRE Y APELLIDO"
                onChange={(e) =>
                  handleInputChange(e, setFieldValue, setFieldError)
                }
              />
              <ErrorMessage name="fullName" component="div" className="error" />
              <Field
                type="email"
                name="mail"
                className={touched.mail && errors.mail ? "input-error" : ""}
                placeholder="MAIL"
                onChange={(e) => setFieldValue("mail", e.target.value)}
              />
              <ErrorMessage name="mail" component="div" className="error" />

              <Field
                type="text"
                name="phone"
                className={touched.phone && errors.phone ? "input-error" : ""}
                placeholder="CELULAR (Sin el '0' ni '-')"
                onChange={(e) =>
                  handleInputChange(e, setFieldValue, setFieldError)
                }
              />
              <ErrorMessage name="phone" component="div" className="error" />

              <Field
                type="text"
                name="license"
                className={
                  touched.license && errors.license ? "input-error" : ""
                }
                placeholder="MATRICULA: MPXXXXXX O MNXXXXXX (6 DÍGITOS)"
                onChange={(e) =>
                  handleInputChange(e, setFieldValue, setFieldError)
                }
              />
              <ErrorMessage name="license" component="div" className="error" />
              <Field
                as="select"
                name="speciality"
                className={
                  touched.speciality && errors.speciality ? "input-error" : ""
                }
                onChange={(e) => setFieldValue("speciality", e.target.value)}
                required
              >
                <option value="">Seleccione una especialidad</option>
                {specialities.map((speciality) => (
                  <option key={speciality.id} value={speciality.id}>
                    {speciality.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="speciality"
                component="div"
                className="error"
              />
              <button type="submit" disabled={isSubmitting} className="btn">
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}

export default FormProfesionals;
