const http = require("http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");

const mime = {
    html: "text/html",
    css: "text/css",
    jpg: "image/jpg",
    ico: "image/x-icon",
    mp3: "audio/mpeg3",
    mp4: "video/mp4",
};

const servidor = http.createServer((pedido, respuesta) => {
    const objetourl = url.parse(pedido.url);
    let camino = "public" + objetourl.pathname;
    if (camino == "public/") camino = "public/index.html";
    encaminar(pedido, respuesta, camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || "0.0.0.0";
servidor.listen(server_port, server_host, function() {
    console.log("Listening on port %d", server_port);
});

function encaminar(pedido, respuesta, camino) {
    console.log(camino);
    switch (camino) {
        case "public/recuperardatos":
            {
                recuperar(pedido, respuesta);
                break;
            }
        default:
            {
                fs.stat(camino, (error) => {
                    if (!error) {
                        fs.readFile(camino, (error, contenido) => {
                            if (error) {
                                respuesta.writeHead(500, { "Content-Type": "text/plain" });
                                respuesta.write("Error interno");
                                respuesta.end();
                            } else {
                                const vec = camino.split(".");
                                const extension = vec[vec.length - 1];
                                const mimearchivo = mime[extension];
                                respuesta.writeHead(200, { "Content-Type": mimearchivo });
                                respuesta.write(contenido);
                                respuesta.end();
                            }
                        });
                    } else {
                        respuesta.writeHead(404, { "Content-Type": "text/html" });
                        respuesta.write(
                            "<!doctype html><html><head></head><body>Recurso inexistente</body></html>"
                        );
                        respuesta.end();
                    }
                });
            }
    }
}

function recuperar(pedido, respuesta) {
    let info = "";
    pedido.on("data", (datosparciales) => {
        info += datosparciales;
    });
    pedido.on("end", () => {
        const formulario = querystring.parse(info);
        respuesta.writeHead(200, { "Content-Type": "text/html" });
        const pagina =
            `<!doctype html><html><head><link rel="stylesheet" href="style.css" /><title>Yankenpón</title></head><body><div class="div">` +
            piedraPapelTijera(formulario["string"]) +
            `</div></body></html>`;
        respuesta.end(pagina);
        console.log(piedraPapelTijera(formulario["string"]));
    });
}

function NumerosAleatorios(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function piedraPapelTijera(string) {
    let string2 = "";
    let piedraPapelTijera = ["p", "a", "t"];
    let respuestaAleatoria = piedraPapelTijera[NumerosAleatorios(0, 2)];
    string = string.toLowerCase();
    console.log(respuestaAleatoria);

    switch (string) {
        case "p":
            if (respuestaAleatoria == "t") {
                string2 = "You Win! <br> El servidor ha elegido tijera ";
            } else {
                string2 = "You Loose! <br> El servidor ha elegido tijera";
            }
            break;
        case "a":
            if (respuestaAleatoria == "p") {
                string2 = "You Win! <br> El servidor ha elegido piedra ";
            } else {
                string2 = "You Loose! <br> El servidor ha elegido piedra";
            }
            break;
        case "t":
            if (respuestaAleatoria == "a") {
                string2 = "You Win! <br> El servidor ha elegido papel ";
            } else {
                string2 = "You Loose! <br> El servidor ha elegido papel";
            }
            break;
    }

    return string2;
}

console.log("Servidor web iniciado");