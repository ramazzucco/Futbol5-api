module.exports = {
    getHTMLreserveHistory: (reserves) => {

        const data = `
        <body>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Email</th>
                            <th scope="col">telefono</th>
                            <th scope="col">Cancha</th>
                            <th scope="col">Horario</th>
                            <th scope="col">Hora Y Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reserves.map((reserve) => {
                        return (
                        `<tr class="datos">
                            <td>${reserve.id}</td>
                            <td>${reserve.name}</td>
                            <td>${reserve.lastname}</td>
                            <td>${reserve.email}</td>
                            <td>${reserve.telefono}</td>
                            <td>${reserve.cancha}</td>
                            <td>${reserve.horario}</td>
                            <td>${reserve.date}</td>
                        </tr>`
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </body>
        <style>
        table {
            width: 100%;
            margin: auto auto;
            border: 1px solid black;
            background-color: black;
        }
        thead {
            background-color: black;
            padding: 10px;
        }
        .datos {
            background-color: white;
        }
        th {
            padding: 10px 0;
            color: white;
        }
        td {
            padding: 10px 0;
            margin: 0;
            text-align: center;
        }
    </style>`

        return data;
    }
}