const rondas = ["Random Mode", "Minuto 1", "Minuto 2", "Deluxe", "4x4"];
let rondaActual = 0;
let puntajes = {
    mc1: [0, 0, 0, 0, 0],
    mc2: [0, 0, 0, 0, 0]
};
let enReplica = false;  // Nueva variable para controlar si estamos en réplica
let puntajesReplica = { mc1: 0, mc2: 0 };  // Puntajes exclusivos para la réplica

document.getElementById("comenzar").addEventListener("click", function() {
    const mc1Nombre = document.getElementById("mc1-nombre").value || "MC1";
    const mc2Nombre = document.getElementById("mc2-nombre").value || "MC2";

    document.getElementById("mc1-nombre-display").textContent = mc1Nombre;
    document.getElementById("mc2-nombre-display").textContent = mc2Nombre;

    document.getElementById("pantalla-inicial").classList.remove("visible");
    document.getElementById("pantalla-rondas").classList.add("visible");

    actualizarRonda();
});

// Evento para actualizar la puntuación en tiempo real
document.getElementById("mc1-calificacion").addEventListener("input", function() {
    document.getElementById("mc1-score").textContent = this.value;
});

document.getElementById("mc2-calificacion").addEventListener("input", function() {
    document.getElementById("mc2-score").textContent = this.value;
});

document.getElementById("siguiente").addEventListener("click", function() {
    if (!enReplica) {
        puntajes.mc1[rondaActual] = parseInt(document.getElementById("mc1-calificacion").value);
        puntajes.mc2[rondaActual] = parseInt(document.getElementById("mc2-calificacion").value);

        if (rondaActual < rondas.length - 1) {
            rondaActual++;
            actualizarRonda();
        } else {
            mostrarResultados();
        }
    } else {
        // Reiniciar puntuaciones para la réplica
        puntajesReplica.mc1 = parseInt(document.getElementById("mc1-calificacion").value);
        puntajesReplica.mc2 = parseInt(document.getElementById("mc2-calificacion").value);
        mostrarResultados();
    }
});

document.getElementById("atras").addEventListener("click", function() {
    if (!enReplica && rondaActual > 0) {
        rondaActual--;
        actualizarRonda();
    }
});

document.getElementById("reiniciar").addEventListener("click", function() {
    rondaActual = 0;
    enReplica = false;
    puntajes = { mc1: [0, 0, 0, 0, 0], mc2: [0, 0, 0, 0, 0] };
    puntajesReplica = { mc1: 0, mc2: 0 };
    document.getElementById("pantalla-final").classList.remove("visible");
    document.getElementById("pantalla-inicial").classList.add("visible");
});

document.getElementById("replica").addEventListener("click", function() {
    enReplica = true;
    rondaActual = -1;  // Usamos -1 para indicar que estamos en la réplica
    document.getElementById("pantalla-final").classList.remove("visible");
    document.getElementById("pantalla-rondas").classList.add("visible");
    actualizarRonda();
});

// Función para generar el archivo Excel usando una plantilla preformateada
function generarExcel() {
    const mc1Nombre = document.getElementById("mc1-nombre-display").textContent;
    const mc2Nombre = document.getElementById("mc2-nombre-display").textContent;

    // Cargar la plantilla preformateada
    fetch("plantilla.xlsx")
        .then(response => response.arrayBuffer())
        .then(data => {
            // Leer el archivo Excel de la plantilla
            const libro = XLSX.read(data, { type: "array" });
            const hoja = libro.Sheets[libro.SheetNames[0]];

            // Llenar los datos en las celdas correspondientes
            hoja["F3"].v = mc1Nombre;
            hoja["G3"].v = mc2Nombre;

            hoja["F4"].v = puntajes.mc1[0];
            hoja["G4"].v = puntajes.mc2[0];
            hoja["F5"].v = puntajes.mc1[1];
            hoja["G5"].v = puntajes.mc2[1];
            hoja["F6"].v = puntajes.mc1[2];
            hoja["G6"].v = puntajes.mc2[2];
            hoja["F7"].v = puntajes.mc1[3];
            hoja["G7"].v = puntajes.mc2[3];
            hoja["F8"].v = puntajes.mc1[4];
            hoja["G8"].v = puntajes.mc2[4];

            // Calcular y llenar los puntajes finales
            const mc1Total = puntajes.mc1.reduce((a, b) => a + b, 0) + (enReplica ? puntajesReplica.mc1 : 0);
            const mc2Total = puntajes.mc2.reduce((a, b) => a + b, 0) + (enReplica ? puntajesReplica.mc2 : 0);
            hoja["F9"].v = mc1Total;
            hoja["G9"].v = mc2Total;

            // Llenar la sección de resultados de la réplica si aplica
            hoja["F12"].v = mc1Nombre;
            hoja["G12"].v = puntajesReplica.mc1;
            hoja["H12"].v = mc2Nombre;
            hoja["I12"].v = puntajesReplica.mc2;

            // Exportar el archivo modificado como Excel
            XLSX.writeFile(libro, "resultados_batalla.xlsx");
        })
        .catch(error => {
            console.error("Error al cargar la plantilla:", error);
        });
}

// Añadir el botón de descargar Excel en la pantalla final
document.getElementById("descargar-excel").addEventListener("click", generarExcel);

function actualizarRonda() {
    if (rondaActual >= 0 && rondaActual < rondas.length) {
        document.getElementById("ronda-titulo").textContent = rondas[rondaActual];
        document.getElementById("mc1-calificacion").value = 0;
        document.getElementById("mc2-calificacion").value = 0;
        document.getElementById("mc1-score").textContent = "0";
        document.getElementById("mc2-score").textContent = "0";
        document.getElementById("mc1-calificacion").max = 10;
        document.getElementById("mc2-calificacion").max = 10;

        if (rondas[rondaActual] === "Deluxe") {
            document.getElementById("mc1-calificacion").max = 4;
            document.getElementById("mc2-calificacion").max = 4;
        }
    } else if (rondaActual === -1) { // Caso de la réplica
        document.getElementById("ronda-titulo").textContent = "Réplica";
        document.getElementById("mc1-calificacion").value = 0;
        document.getElementById("mc2-calificacion").value = 0;
        document.getElementById("mc1-score").textContent = "0";
        document.getElementById("mc2-score").textContent = "0";
    }
}

function mostrarResultados() {
    document.getElementById("pantalla-rondas").classList.remove("visible");
    document.getElementById("pantalla-final").classList.add("visible");

    const mc1Nombre = document.getElementById("mc1-nombre-display").textContent;
    const mc2Nombre = document.getElementById("mc2-nombre-display").textContent;

    const mc1Total = puntajes.mc1.reduce((a, b) => a + b, 0) + (enReplica ? puntajesReplica.mc1 : 0);
    const mc2Total = puntajes.mc2.reduce((a, b) => a + b, 0) + (enReplica ? puntajesReplica.mc2 : 0);

    document.getElementById("mc1-nombre-final").textContent = mc1Nombre;
    document.getElementById("mc1-total").textContent = `Total: ${mc1Total}`;
    document.getElementById("mc2-nombre-final").textContent = mc2Nombre;
    document.getElementById("mc2-total").textContent = `Total: ${mc2Total}`;

    const ganador = mc1Total > mc2Total ? mc1Nombre : mc2Nombre;
    document.getElementById("ganador").textContent = `Ganador: ${mc1Total === mc2Total ? "Empate" : ganador}`;
}