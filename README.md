# SaludNet

SaludNet es una página web interactiva sobre consultorios médicos, donde los usuarios pueden observar a los profesionales que allí atienden y obtener un turno si lo desean.

## Objetivo

Nuestro objetivo es brindarle la posibilidad a un grupo de profesionales de la salud a que puedan administrar su propio sitio seguro, accesible solo a través de un usuario registrado. Los profesionales pueden incorporar, editar o eliminar su lista de oferta profesional y su agenda laboral.

## Tecnologías Utilizadas

- **Base de datos:** MySQL Workbench
- **Backend:** NestJs
- **Frontend:** React

## Repositorios

- **Frontend:** [SaludNetFront](https://github.com/Manuelsevero91/SaludNetFront.git)
- **Backend:** [SaludNetTorm2](https://github.com/imolinap9191/SaludNetTorm2.git)

## Dependencias

### Backend

- `@nestjs/common`
- `@nestjs/core` "^10.0.0"
- `@nestjs/jwt`
- `@nestjs/mapped-types`
- `@nestjs/platform-express`
- `@nestjs/typeorm`
- `bcryptjs`
- `class-transformer`
- `class-validator`
- `dotenv`
- `mysql2`
- `reflect-metadata`
- `rxjs`
- `typeorm`
- `uuid`

### Frontend

- `@fortawesome/free-brands-svg-icons`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/react-fontawesome`
- `react`
- `react-calendar`
- `react-dom`
- `react-loader-spinner`
- `react-modal`
- `react-parallax`
- `react-router-dom`
- `react-select`
- `react-slick`
- `react-spinners`
- `slick-carousel`
- `sweetalert2`

## Variables de Entorno

Asegúrate de definir las siguientes variables de entorno:

```plaintext
SECRET=
DB_TYPE=
HOST=
USER_DB_NAME=
USER_DB_PASSWORD=
PORT=
DB_NAME=

