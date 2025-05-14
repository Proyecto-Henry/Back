# Documentacion

### Respuesta logueo exitoso
### POST'.../auth/login'

### Estructura de la Peticion esperada

{
	"email": "example@gmail.com",
	"password": "ContraSegu1@"
}

### ✅Respuesta con status code 200 para un user

{
	"message": "✅Login exitoso! Bienvenido",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0NmM0NTQ0LTIwNjctNGNiMC05N2M3LWY3ZjhiNTBmOWNkOSIsImVtYWlsIjoiZXhhbXBsZTFAZ21haWwuY29tIiwic3RhdHVzIjoiYWN0aXZlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDcyMjMwNDUsImV4cCI6MTc0NzI4Nzg0NX0.KTrflclGUeYzZAr-LjWlETDo5iPembOluy4O_JvVnN0",
	"user": {
		"id": "146c4544-2067-4cb0-97c7-f7f8b50f9cd9",
		"email": "exampleUser@gmail.com",
		"role": "user"
	}
}

### ✅Respuesta con status code 200 para un admin

{
	"message": "✅Login exitoso! Bienvenido adminName",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMjNkNmViLTA3OGMtNGMzNi05NjY0LTUyMDkzMWY2NmIwMSIsImVtYWlsIjoiZXhhbXBsZUBsaXZlLmNvbS5hciIsInN0YXR1cyI6ImFjdGl2ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzIyNDAxOCwiZXhwIjoxNzQ3Mjg4ODE4fQ.ZPmOByx2i784YemtmTZmQ2dXNB0HkSs2domNwJ_U7GE",
	"user": {
		"name": "adminName",
		"id": "d023d6eb-078c-4c36-9664-520931f66b01",
		"email": "exampleAdmin@gmail.com",
		"role": "admin"
	}
}

### Se crea una variable role que segun en que tabla encuentra al usuario le asigne el valor user o admin.

### ❌Respuesta con status code 400

{
	"message": "❌Credenciales inválidas",
	"error": "Unauthorized",
	"statusCode": 401
}