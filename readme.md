# API - Futbol 5

## Estructura

![Ver la estructura de carpetas.](https://github.com/ramazzucco/Futbol5_api/blob/master/public/images/estructura_carpetas.png "Estructura carpetas.")

---

    Rutas
- <span style="color: lightblue">access</span> :
Maneja todo lo relacionado a los admin, la pagina no tiene sistema de usuarios, ya que la reserva es directa y no posee pago online.

- <span style="color: lightblue">reserves</span> :
Maneja todo lo relacionado a las reservas, ya sean reservas del dia o el historial.

- <span style="color: lightblue">page</span> :
Maneja todo lo relacionado a la pagina ya sea para obtenr la data como para modificarla.

- <span style="color: lightblue">finance</span> :
Es una nueva seccion creada para el admin.

---
    Middlewares

- <span style="color: lightblue">auth</span> :
Es para proteger las rutas del administrador.

- <span style="color: lightblue">validate</span> :
Para la validacion de los formularios.
---
    Database

- <span style="color: lightblue">Archivos json</span> :
Para guardar los datos.

- <span style="color: lightblue">Archivos js</span> :
Son classes exportadas como modulos para manipular los archivos json.

---
    Controllers

- <span style="color: lightblue">Archivos js</span> :
Cada controlador con su ruta correspondiente, en los mismos importo las classes de la base de datos.
