#  Sistema de Gestión y Ventas


## Descripción

Nuestra aplicación web esta enfocada para que un usuario "Administrador" tenga un control total sobre sus sucursales. Entre sus posibilidades se encuentran:
- agregar o quitar stock en la mismas. 
- gestionar sucursales (crear, modificar o eliminar).
- Y muchas otras funcionalidades. 


## Empezando

1. Para empezar lo primero que hay que hacer es clonarnos el repositorio:

    ```bash git clone https://github.com/Proyecto-Henry/Back.git```

2. Luego empezaremos instalando las dependecias del proyecto con: 

    ```$ npm install```

3. Estructura del Proyecto 
```
/src
    /config # Configuración de la base de datos y otros servicios
    /entities # Entidades de la base de datos
    /enums # Enums para roles, planes, etc.
    /guards # Guards utilizados para protección de rutas
    /middlewares # Middlewares que manejan lógica adicional
    /modules 
        /admins # Módulo de administración
        /auth # Módulo de autenticación
        /country # Módulo para gestionar países
        /products # Módulo para la gestión de productos
        /sales # Módulo de ventas
        /stores # Módulo de sucursales
        /subscriptions # Módulo para gestionar suscripciones
        /users # Módulo de usuarios
    /seeds # Seeds que se inyectan automáticamente para poblar la base de datos
```

4. Configuración del archivo .env.development: <br>
    En el archivo env.example podrás ver un ejemplo de las variables de configuración necesarias.

    3.1: En el caso de no poder visualizar el archivo, tu .env.development debería lucir de esta manera 
    ```env
    DB_NAME=
    DB_HOST=
    DB_PORT=
    DB_USERNAME=
    DB_PASSWORD=
    JWT_SECRET=
    PORT=
    GOOGLE_CLIENT_ID= 
    ```

5. Rutas creadas: 
    Para conocer las rutas de la API, se pueden saber utilizando Swagger en la siguiente ruta:
    ```
     http://localhost:PORT/api
    ```
    Ahi podrás ver todas las rutas disponibles, parámetros que aceptan y posibles respuestas.

