<p align="center">
  <img src="https://res.cloudinary.com/dtwxythux/image/upload/v1746139566/37da6594c977bf38c2aa11511ce359249c7fc531_kbk3m9.png" width="120" alt="Safestock logo" />
</p>

#  Sistema de Gestión y Ventas


## Descripción

Nuestra aplicación web esta enfocada para que un usuario "Administrador" tenga un control total sobre sus sucursales. Entre sus posibilidades se encuentran:

- agregar o quitar stock en la mismas. 
- gestionar sucursales (crear, modificar o eliminar).
- Y muchas otras funcionalidades. 


## Empezando

1. Para empezar lo primero que hay que hacer es clonarnos el repositorio:

    ```bash git clone https://github.com/Proyecto-Henry/Back.git```

2. Luego empezaremos instalando las dependencias del proyecto con: 

    ```$ npm install```

3. Estructura del Proyecto 
```
/src
    /common # Clases o utilidades reutilizables
    /config # Configuración de la base de datos y otros servicios
    /crons # Tareas programadas (cron jobs)
    /entities # Entidades de la base de datos
    /enums # Enums para roles, planes, etc.
    /guards # Guards utilizados para protección de rutas
    /middlewares # Middlewares que manejan lógica adicional
    /modules 
        /admins # Módulo de administración
        /auth # Módulo de autenticación
        /country # Módulo para gestionar países
        /files # Subida y gestión de archivos (como imágenes) 
        /products # Módulo para la gestión de productos
        /sales # Módulo de ventas
        /stores # Módulo de sucursales
        /subscriptions # Módulo para gestionar suscripciones
        /users # Módulo de usuarios
    /seeds # Seeds que se inyectan automáticamente para poblar la base de datos
/app.module.ts # Módulo raíz de la aplicación
/main.ts # Punto de entrada principal
```

4. Configuración del archivo .env.development: <br>
    En el archivo .env.example podrás ver un ejemplo de las variables de configuración necesarias.

    ### 4.1: En el caso de no poder visualizar el archivo, tu .env.development debería lucir de esta manera 
    ```env
        #Database
        DB_NAME=
        DB_HOST=
        DB_PORT=
        DB_USERNAME=
        DB_PASSWORD=

        #Cloudinary
        CLOUDINARY_CLOUD_NAME=
        CLOUDINARY_API_SECRET=
        CLOUDINARY_API_KEY=

        #JWT tokens
        JWT_SECRET=
        
        #Stripe
        STRIPE_SECRET_KEY=
        FRONTEND_URL=
        
        #Nodemailer
        MAIL_USER=cuenta_gmail
        MAIL_PASS=
    ```

    ### 4.2: Rellenando las variables de entorno
   
        Database: Para el caso de las variables de Database, llenar con las variables de tu entorno
            DB_NAME # Nombre de la base de datos
            DB_HOST # Host de este (ej: localhost)
            DB_PORT # Puerto (ej: 3001)
            DB_USERNAME # Username requerido (ej: postgres)
            DB_PASSWORD # Password requerida (ej: contraseña)

        Cloudinary: Estas se obtienen desde la pagina de cloudinary una vez creamos la cuenta y un entorno con su respectiva "API Key"
        En la siguiente imagen se puede ver de donde sacar cada dato siendo

            CLOUDINARY_CLOUD_NAME # Nombre de tu cuenta (Remarcado en verde)
            CLOUDINARY_API_SECRET # API Secret (Remarcada en naranja (en caso de perder este dato, en el ojo se puede recuperar))
            CLOUDINARY_API_KEY # API Key (Remarcada en azul)

   

![Vista previa Cloudinary](/assets/cloudinary.png)


        JWT token: Crear un token secreto para el uso de JWT
            JWT_SECRET # Secreto que se usara para firmar los tokens emitidos

        Stripe: Para el caso de las variables de Stripe 
            STRIPE_SECRET_KEY # Esta se obtiene de el panel Desarrolladores > Claves de API > Clave secreta (dentro de Claves Standard) 
            FRONTEND_URL # Falta definir

        Nodemailer
            MAIL_USER # Gmail que se utilizara al mandar avisos (Ej: noreply@safestock.com)
            MAIL_PASS # Para esta debemos obtener una contraseña de aplicación, debajo habrá un articulo oficial por parte de Google para la obtención de la misma
            Nota: Encerrar la variable de MAIL_PASS entre comillas, ej: "XXXX XXXX XXXX XXXX"
Foro oficial para contraseña de aplicación:  
[https://support.google.com/accounts/answer/185833?hl=es-419](https://support.google.com/accounts/answer/185833?hl=es-419)

5. Luego podemos probar que el proyecto funcione haciendo: 

    ```$ npm run start:dev```

6. Rutas creadas: 
    Una vez el proyecto ya esta en funcionamiento para conocer las rutas de la API, se pueden saber utilizando Swagger en la siguiente ruta:
    ```
     http://localhost:PORT/api
    ```
    Ahi podrás ver todas las rutas disponibles, parámetros que aceptan y posibles respuestas.



###  Tecnologías Usadas

```markdown
## Tecnologías utilizadas

- [NestJS](https://nestjs.com/) 
- [TypeORM](https://typeorm.io/) 
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) 
- [Google Auth](https://developers.google.com/identity) 
- [Swagger](https://swagger.io/) 