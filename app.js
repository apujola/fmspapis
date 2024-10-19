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
    rondaActual = "Réplica";  // Etiqueta especial para la réplica
    document.getElementById("pantalla-final").classList.remove("visible");
    document.getElementById("pantalla-rondas").classList.add("visible");
    actualizarRonda();
});

// Función para generar el archivo Excel
function generarExcel() {
    const mc1Nombre = document.getElementById("mc1-nombre-display").textContent;
    const mc2Nombre = document.getElementById("mc2-nombre-display").textContent;

    const datos = [
        ["BATALLA"],
        ["RONDA", mc1Nombre, mc2Nombre],
        ["RANDOM MODE", puntajes.mc1[0], puntajes.mc2[0]],
        ["MINUTO 1", puntajes.mc1[1], puntajes.mc2[1]],
        ["MINUTO 2", puntajes.mc1[2], puntajes.mc2[2]],
        ["DELUXE", puntajes.mc1[3], puntajes.mc2[3]],
        ["4X4", puntajes.mc1[4], puntajes.mc2[4]],
        ["FINAL", puntajes.mc1.reduce((a, b) => a + b, 0), puntajes.mc2.reduce((a, b) => a + b, 0)]
    ];

    // Crea una hoja de cálculo
    const hoja = XLSX.utils.aoa_to_sheet(datos);

    // Crea un nuevo libro
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Resultados");

    // Exporta el archivo Excel
    XLSX.writeFile(libro, "resultados_batalla.xlsx");
}

// Añadir el botón de descargar Excel en la pantalla final
document.getElementById("descargar-excel").addEventListener("click", generarExcel);

function actualizarRonda() {
    if (rondaActual < rondas.length) {
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
    } else {
        document.getElementById("ronda-titulo").textContent = "Réplica";
        document.getElementById("mc1-calificacion").max = 10;
        document.getElementById("mc2-calificacion").max = 10;
    }
}

function mostrarResultados() {
    document.getElementById("pantalla-rondas").classList.remove("visible");
    document.getElementById("pantalla-final").classList.add("visible");

    const mc1Nombre = document.getElementById("mc1-nombre-display").textContent;
    const mc2Nombre = document.getElementById("mc2-nombre-display").textContent;

    document.getElementById("mc1-nombre-final").textContent = mc1Nombre;
    document.getElementById("mc1-total").textContent = "Total: " + puntajes.mc1.reduce((a, b) => a + b, 0);
    document.getElementById("mc2-nombre-final").textContent = mc2Nombre;
    document.getElementById("mc2-total").textContent = "Total: " + puntajes.mc2.reduce((a, b) => a + b, 0);

    const totalMC1 = puntajes.mc1.reduce((a, b) => a + b, 0);
    const totalMC2 = puntajes.mc2.reduce((a, b) => a + b, 0);

    if (totalMC1 > totalMC2) {
        document.getElementById("ganador").textContent = mc1Nombre + " gana la batalla directa";
    } else if (totalMC1 < totalMC2) {
        document.getElementById("ganador").textContent = mc2Nombre + " gana la batalla directa";
    } else {
        document.getElementById("ganador").textContent = "¡Tenemos una réplica!";
    }
}