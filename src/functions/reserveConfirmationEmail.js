module.exports = {
    getHTMLemail: (data) => {
        const HTMLemail =
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p class="important">
                <span>IMPORTANTE!</span> : Tiene 1 hora para abonar la reserva, de lo contrario la misma será cancelada automaticamente por el sistema.
            </p>
            <hr>
            <div class="card">
                <div class="card-header">
                    <img src="" alt="LOGO">
                    <p>La Reserva fue Exitosa!</p>
                </div>
                <div class="body">
                    <h4 class="name">${data.name} ${data.lastname}</h4>
                    <h4 class="text">Ha Reservado la CANCHA N° ${data.cancha} a las ${data.horario} hs!</h4>
                    <h4 class="reserve">Numero de Reserva: ${data.id}</h4>
                </div>
            </div>
            <hr>
            <div class="contact">
                <img src="" alt="LOGO">
                <ul>
                    <li>Telefono: 4-331122</li>
                    <li>Direccion: Calle Falsa 123</li>
                    <li>Email: tumarca@gmail.com</li>
                </ul>
            </div>
        </body>
        <style>
        .card {
            background-color: rgba(0,255,0,.9);
            box-shadow: 5px 5px 10px 5px black;
            width: 75%;
            margin: 100px auto;
        }
        .card-header {
            display: flex;
            background-color: rgba(0,0,0,.2);
        }
        .card-header img {
            background-color: rgba(0,0,0,.3);
            padding: 30px;
            border-radius: 50%;
        }
        .card-header p {
            color: rgba(0,50,0,.8);
            margin: 0 auto;
            align-self: center;
            text-align: center;
            text-transform: uppercase;
            font-weight: 100;
            font: italic bold 50px Georgia, Serif;
            text-shadow: 2px 2px 10px rgba(100,100,100,.8);
        }
        .body {
            padding: 30px 20px;
        }
        .body h4 {
            text-align: center;
        font: italic bold 30px Georgia, Serif;
        }
        .name {
            margin-top: 20px;
            font-weight: bold;
        }
        .text {
            margin: 40px 0;
        }
        .reserve {
            margin-top: 20px;
        }
        .important {
            background-color: cornflowerblue;
            padding: 30px;
            border-radius: 25px;
            text-align: center;
        }
        .important span {
            color: darkgoldenrod;
            font-weight: bold;
        }
        .contact {
            display: flex;
            flex-direction: row;
            margin: 10px 0 10px 30px;
            width: 500px;
            background-color: black;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 1px 1px 2px 1px gray;
        }
        .contact img {
            padding: 30px 20px;
            margin-right: 20px;
            align-self: center;
            color: goldenrod;
            border: 1px solid goldenrod;
            border-radius: 50%;

        }
        .contact ul {
            color: goldenrod;
            display: flex;
            flex-direction: column;
            align-self: center;
            margin-bottom: 0;
            border-left:  1px solid goldenrod;
        }
        </style>
        </html>

        `;

        return HTMLemail;

    }
}