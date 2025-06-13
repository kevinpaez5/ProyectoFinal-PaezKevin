let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
let lugaresDisponibles = [];

cargarLugares();
mostrarReservas();

async function cargarLugares() {
    try {
        const response = await fetch("lugares.json");
        const lugares = await response.json();

        if (!localStorage.getItem("lugaresDisponibles")) {
            localStorage.setItem("lugaresDisponibles", JSON.stringify(lugares));
        }

        lugaresDisponibles = JSON.parse(localStorage.getItem("lugaresDisponibles"));

        mostrarLugares(lugaresDisponibles);
    } catch (error) {
        console.error("Error al cargar los lugares:", error);
    }
}

function mostrarLugares(lugares) {
    const lugaresDiv = document.getElementById("lugares");
    lugaresDiv.innerHTML = "";

    lugares.forEach(lugar => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${lugar.imagen}" alt="${lugar.nombre}">
            <h3>${lugar.nombre}</h3>
            <p>Ubicación: ${lugar.ubicacion}</p>
            <p>Cupos disponibles: <span id="cupos-${lugar.id}">${lugar.cupos}</span></p>
            <p>Fecha de Trekking: <strong>${lugar.fecha}</strong></p>
            <label for="personas-${lugar.id}">Cantidad de personas:</label>
            <input type="number" id="personas-${lugar.id}" min="1" max="${lugar.cupos}" placeholder="1">
            <button onclick="reservar(${lugar.id})">Reservar</button>
        `;
        lugaresDiv.appendChild(card);
    });
}

function reservar(idLugar) {
    const lugar = lugaresDisponibles.find(l => l.id === idLugar);
    const inputPersonas = document.getElementById(`personas-${idLugar}`);
    const personas = parseInt(inputPersonas.value);

    if (isNaN(personas) || personas <= 0) {
        Swal.fire("Error", "Debe ingresar una cantidad válida de personas.", "error");
        return;
    }

    if (personas > lugar.cupos) {
        Swal.fire("Error", `No hay suficientes cupos disponibles. Cupos disponibles: ${lugar.cupos}`, "error");
        return;
    }

    const nuevaReserva = {
        id: Date.now(),
        idLugar,
        nombreLugar: lugar.nombre,
        personas,
        fecha: lugar.fecha
    };

    reservas.push(nuevaReserva);

    lugar.cupos -= personas;

    guardarReservas();
    localStorage.setItem("lugaresDisponibles", JSON.stringify(lugaresDisponibles));

    mostrarLugares(lugaresDisponibles);
    mostrarReservas();

    inputPersonas.value = "";  
    Swal.fire("Reserva realizada correctamente!", "", "success");
}

function mostrarReservas() {
    const reservasDiv = document.getElementById("reservas");
    if (!reservasDiv) return;

    reservasDiv.innerHTML = "";

    if (reservas.length === 0) {
        reservasDiv.innerHTML = "<p>No hay reservas.</p>";
        return;
    }

    reservas.forEach((reserva, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${reserva.nombreLugar}</h3>
            <p>Personas: ${reserva.personas}</p>
            <p>Fecha: ${reserva.fecha}</p>
            <button onclick="eliminarReserva(${index})">Eliminar</button>
        `;
        reservasDiv.appendChild(card);
    });
}

function eliminarReserva(index) {
    Swal.fire({
        title: '¿Está seguro que desea eliminar esta reserva?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const reserva = reservas[index];
            const lugar = lugaresDisponibles.find(l => l.id === reserva.idLugar);

            if (lugar) {
                lugar.cupos += reserva.personas;
            }

            reservas.splice(index, 1);
            guardarReservas();
            localStorage.setItem("lugaresDisponibles", JSON.stringify(lugaresDisponibles));

            mostrarLugares(lugaresDisponibles);
            mostrarReservas();

            Swal.fire('Eliminada', 'Su reserva fue eliminada.', 'success');
        }
    });
}

function guardarReservas() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}
