<p align="center">
  <img src="https://res.cloudinary.com/dtwxythux/image/upload/v1746139566/37da6594c977bf38c2aa11511ce359249c7fc531_kbk3m9.png" width="120" alt="Safestock logo" />
</p>

#  Sistema de Gestión y Ventas - Backend (NestJS) - Proyecto Final Bootcamp Henry

## 📋 Descripción del Proyecto

Nuestra aplicación web esta enfocada para que un usuario "Administrador" tenga un control total sobre sus sucursales. Entre sus posibilidades se encuentran:

- **Gestión de Tiendas:** Crear sucursales asociadas a administradores y usuarios vendedores.
- **Gestión de Productos:** Crear, asignar stock, actualizar, y eliminar productos asociados a tiendas.
- **Gestión de Ventas:** Crear, consultar y eliminar una venta si es necesario.
- **Suscripciones:** Manejar suscripciones de administradores, incluyendo creación, cancelación, reactivación y cambio de planes.
- **Autenticación:** Registro y login de usuarios con roles, incluyendo autenticación con Google.
- **Archivos:** Subida de imágenes para administradores y tiendas.
- **SuperAdmin:** Gestión de superadministradores con permisos elevados.

Se utilizó **NestJS** y **TypeORM** para gestionar ventas, productos, tiendas, usuarios, administradores y suscripciones y **Nodemailer** para enviar correos de verificación durante el registro de usuarios. También incluye manejo de transacciones para operaciones críticas (como la eliminación de ventas), autenticación basada en JWT. Además se utilizó la pasarela de pagos **Stripe** para suscripciones de pago y **Cloudinary** para la carga de imágenes en la nube.

## 🚀 Características Principales

- **Arquitectura Modular:** Código organizado en módulos (Admins, Users, Sales, Stores, etc.).
- **Autenticación y Autorización:** login con JWT, incluyendo autenticación con Google.
- **Gestión de Inventario:** Restauración automática de stock al eliminar una venta errónea.
- **Verificación por Correo:** Registro de usuarios con verificación vía email usando Nodemailer.
- **Manejo de Archivos:** Subida de imágenes para administradores y tiendas.
- **Suscripciones:** Gestión completa de suscripciones, con cambio de planes y soporte para webhooks.
- **Seguridad:** Endpoints protegidos con guards JWT.

## 🛠️ Tecnologías Utilizadas

- **NestJS**: Framework principal para el backend. https://nestjs.com/
- **TypeScript**: Lenguaje para desarrollo tipado. 
- **TypeORM**: ORM para interactuar con la base de datos. https://typeorm.io/
- **PostgreSQL**: Base de datos relacional. https://www.postgresql.org/
- **Nodemailer**: Para enviar correos de verificación.
- **JWT**: Autenticación basada en tokens. https://jwt.io/
- **Node.js**: Entorno de ejecución.
- **Git**: Control de versiones.

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (v20 o superior)
- PostgreSQL (o el motor de base de datos que prefieras)
- Tener las claves para los servicios de terceros de:
Cloudinary, Stripe y Nodemailer 

### Empezando

1. **Lo primero que hay que hacer es clonarnos el repositorio:**

    ```bash
    git clone https://github.com/Proyecto-Henry/Back.git
    ```

2. **Instala las dependencias del proyecto con:**

    ```bash
    npm install
    ```

3. **Configura las variables de entorno:**

   En el archivo env.example podrás ver un ejemplo de las variables de configuración necesarias.
   Crea un archivo `.env.development` en la raíz del proyecto y configura las siguientes variables:

   ```
   # Configuración de la base de datos
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=tu_usuario
   DATABASE_PASSWORD=tu_contraseña
   DATABASE_NAME=sistema_gestion

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_API_KEY=

   # Configuración de JWT
   JWT_SECRET=tu_secreto_jwt

   # Stripe
   STRIPE_SECRET_KEY=

   # Configuración de correo (Nodemailer)
   EMAIL_USER=tu-correo@gmail.com
   EMAIL_PASS=tu-contraseña-de-aplicacion

   # Puerto de la aplicación
   PORT=3000
   ```
4. **Configura la base de datos:**

   Podés utilizar PostgreSQL y crear una base de datos llamada `sistema_gestion`. Luego, TypeORM sincronizará las entidades automáticamente.

5. **Rellenando las Variables de Entorno**

**Cloudinary**
Las credenciales de Cloudinary se obtienen desde su página oficial una vez que creas una cuenta y configuras un entorno. Los datos necesarios son:

- **CLOUDINARY_CLOUD_NAME:** Nombre de tu cuenta (remarcado en verde en la imagen).
- **CLOUDINARY_API_KEY:** Clave de API (remarcada en azul en la imagen).
- **CLOUDINARY_API_SECRET:** Secreto de API (remarcado en naranja en la imagen).  
  **Nota:** Si pierdes este dato, puedes recuperarlo haciendo clic en el ícono de "ojo" en el panel de Cloudinary.

![Vista previa de Cloudinary](/assets/cloudinary.png)

#### **JWT**
Para la autenticación con JWT, necesitas crear una clave secreta:

- **JWT_SECRET:** Secreto que se usará para firmar los tokens emitidos.  
  **Ejemplo:** `mi_clave_secreta_123`.

#### **Stripe**
Las credenciales de Stripe se obtienen desde su panel de control:

- **STRIPE_SECRET_KEY:** Ve a *Desarrolladores > Claves de API > Clave secreta* (dentro de *Claves Estándar*) en el panel de Stripe.

#### **Nodemailer**
Para enviar correos con Nodemailer, configura las siguientes variables:

- **MAIL_USER:** Dirección de Gmail que usarás para enviar avisos.  
  **Ejemplo:** `noreply@safestock.com`.
- **MAIL_PASS:** Contraseña de aplicación de Gmail.  
  **Nota:** Debes generar una contraseña de aplicación en tu cuenta de Google. Encierra esta variable entre comillas.  
  **Ejemplo:** `"XXXX XXXX XXXX XXXX"`.  
  **Recurso:** Consulta el artículo oficial de Google para obtener una contraseña de aplicación:  
  [Cómo generar una contraseña de aplicación](https://support.google.com/accounts/answer/185833?hl=es-419)

6. **Inicia la aplicación:**

   ```bash
   npm run start:dev
   ```

   La aplicación estará disponible en `http://localhost:3000/api`.
   Podrás ver las rutas de la API a través de Swagger con los parámetros que aceptan y posibles respuestas.

## Estructura del Proyecto

A continuación, se detalla la estructura de directorios y archivos del proyecto, organizada dentro del directorio raíz `/src`. Cada carpeta contiene componentes específicos de la aplicación.

```plaintext
/src
  /common          # Clases y utilidades reutilizables en toda la aplicación.
  /config          # Configuración de la base de datos y otros servicios
  /crons           # Tareas programadas (cron jobs) para ejecutar procesos automáticos.
  /entities        # Entidades de la base de datos, definidas para TypeORM.
  /enums           # Enumeraciones para roles, planes, estados y otros valores constantes.
  /guards          # Guards para proteger rutas y controlar el acceso.
  /middlewares     # Middlewares que manejan lógica adicional en las solicitudes.
  /modules         # Módulos de la aplicación, organizados por funcionalidad.
    /admins        # Módulo para la gestión de administradores.
    /auth          # Módulo de autenticación y manejo de sesiones.
    /country       # Módulo para gestionar países.
    /files         # Módulo para la subida y gestión de archivos, como imágenes.
    /products      # Módulo para la gestión de productos.
    /sales         # Módulo para registrar y gestionar ventas.
    /stores        # Módulo para la gestión de sucursales o tiendas.
    /subscriptions # Módulo para gestionar suscripciones y planes.
    /superAdmins   # Módulo para la gestión de administradores con permisos elevados.
    /users         # Módulo para la gestión de usuarios.
  /seeds           # Archivos para poblar automáticamente la base de datos con datos iniciales.
/app.module.ts     # Módulo raíz de la aplicación
/main.ts           # Punto de entrada principal
```

## 📚 Documentación de Endpoints

A continuación, se listan todos los endpoints disponibles en la API. Los endpoints protegidos requieren un token JWT en el encabezado `Authorization` (formato `Bearer <token>`).

### **Admins**
| Método | Endpoint                 | Descripción                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/admins/stores/{adminId}` | Obtiene las tiendas de un admin.    |
| GET    | `/admins/{admin_id}`      | Obtiene un admin por su ID.         |
| PATCH  | `/admins/{admin_id}`      | Desactiva un admin por su ID.       |
| DELETE | `/admins/{admin_id}`      | Elimina un admin por su ID.         |
| PUT    | `/admins`                | Actualiza datos de un admin.          |
| GET    | `/admins`                | Obtiene todos los admins.           |

### **Users**
| Método | Endpoint            | Descripción                          |
|--------|---------------------|--------------------------------------|
| PATCH  | `/users/{user_id}`  | Desactiva un usuario por su ID.     |
| GET    | `/users/{id}`       | Obtiene un usuario por su ID.       |
| GET    | `/users`            | Obtiene todos los usuarios.         |

### **Auth**
| Método | Endpoint               | Descripción                          |
|--------|------------------------|--------------------------------------|
| POST   | `/auth/login`         | Inicia sesión y devuelve un token JWT. |
| POST   | `/auth/signUpAdmin`   | Registra un nuevo admin. |
| POST   | `/auth/signUpStore`   | Registra una nueva tienda.          |
| POST   | `/auth/signinGoogle`  | Inicia sesión con Google.           |

### **Products**
| Método | Endpoint               | Descripción                          |
|--------|------------------------|--------------------------------------|
| POST   | `/products`           | Crea un nuevo producto.             |
| GET    | `/products/{store_id}`| Obtiene productos de una tienda.    |
| PATCH  | `/products/{product_id}` | Actualiza un producto por su ID.  |
| DELETE | `/products/{product_id}` | Elimina un producto por su ID.    |

### **Subscriptions**
| Método | Endpoint                              | Descripción                          |
|--------|---------------------------------------|--------------------------------------|
| GET    | `/subscriptions/admin/{admin_id}`    | Obtiene suscripcion de un admin.  |
| GET    | `/subscriptions/user/{user_id}`      | Obtiene suscripcion de un admin por id de usuario.|
| POST   | `/subscriptions/createSubscription`  | Crea una nueva suscripción.         |
| POST   | `/subscriptions/canceledSubscription/{subscription_id}` | Cancela una suscripción. |
| POST   | `/subscriptions/reactivateSubscription/{subscription_id}` | Reactiva una suscripción. |
| POST   | `/subscriptions/changePlan`          | Cambia el plan de una suscripción.  |
| POST   | `/subscriptions/webhook`             | Maneja webhooks de suscripciones.   |

### **Sales**
| Método | Endpoint                   | Descripción                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/sales`                   | Obtiene todas las ventas.           |
| POST   | `/sales`                   | Crea una venta.               |
| GET    | `/sales/{sale_id}`         | Obtiene una venta por su ID.        |
| PATCH  | `/sales/{sale_id}/disable` | Elimina una venta y restaura el stock de los productos. |
| GET    | `/sales/store/{store_id}`  | Obtiene ventas de una tienda.     |
| PATCH  | `/sales/store/{store_id}`  | Elimina ventas de una tienda.     |

### **Stores**
| Método | Endpoint                 | Descripción                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/stores/store/{store_id}` | Obtiene una tienda por su ID.     |
| GET    | `/stores/admin/{admin_id}` | Obtiene tiendas de un admin.      |
| GET    | `/stores/user/{user_id}`  | Obtiene tienda asociada a un usuario. |
| DELETE | `/stores/{store_id}`     | Elimina una tienda por su ID.      |

### **Country**
| Método | Endpoint     | Descripción                          |
|--------|--------------|--------------------------------------|
| GET    | `/country`  | Obtiene información de países.      |

### **Files**
| Método | Endpoint                        | Descripción                          |
|--------|---------------------------------|--------------------------------------|
| POST   | `/files/uploadImageAdmin/{admin_id}` | Sube una imagen para un admin.  |
| POST   | `/files/uploadImageStore/{store_id}` | Sube una imagen para una tienda.|

### **SuperAdmin**
| Método | Endpoint         | Descripción                          |
|--------|------------------|--------------------------------------|
| GET    | `/super`        | Obtiene todos los superadmin.  |
| POST   | `/super/admin`  | Crea un nuevo superadmin.           |

## 📬 Contacto

Si tienes preguntas o quieres colaborar, contáctanos:

- **Email:** [proyectohenry6@gmail.com](mailto:tu-email@ejemplo.com)
- **GitHub:** [https://github.com/Proyecto-Henry](https://github.com/tu-usuario)

---
¡Explorá el código, prueba la aplicación y dejanos tu feedback!
¡Gracias por visitar este repositorio!