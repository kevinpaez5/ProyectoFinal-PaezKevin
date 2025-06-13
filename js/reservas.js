let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

mostrarReservas();

const botonConfirmar = document.getElementById("confirmarReservas");
if (botonConfirmar) {
    botonConfirmar.addEventListener("click", confirmarReservas);
}

function mostrarReservas() {
    const reservasDiv = document.getElementById("reservas");
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
            reservas.splice(index, 1);
            guardarReservas();
            mostrarReservas();
            Swal.fire('Eliminada', 'Su reserva fue eliminada.', 'success');
        }
    });
}

function guardarReservas() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

function confirmarReservas() {
    if (reservas.length === 0) {
        Swal.fire("No hay reservas para confirmar.", "", "info");
        return;
    }

    Swal.fire({
        title: "¿Deseás confirmar tus reservas?",
        text: "Una vez confirmadas se eliminarán del sistema.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            reservas = [];
            localStorage.removeItem("reservas");
            localStorage.removeItem("lugaresDisponibles");
            mostrarReservas();
            Swal.fire("¡Gracias por reservar!", "Tus reservas fueron confirmadas.", "success");
        }
    });
}
