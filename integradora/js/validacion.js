function validarInputBlur(inputId, longitudMinima = 1) {
    const input = document.getElementById(inputId);
    const mensajeError = document.getElementById("mensajeError");

    if (!input) {
        console.error(`No se encontró el input con ID "${inputId}"`);
        return;
    }
    
    input.addEventListener("blur", () => {
        const valor = input.value.trim(); // Remover espacios en blanco
        
        if (valor === "") {
            mensajeError.textContent = "El campo no puede estar vacío.";
            mensajeError.style.display = "block";
        } else if (valor.length < longitudMinima) {
            mensajeError.textContent = `El campo debe tener al menos ${longitudMinima} caracteres.`;
            mensajeError.style.display = "block";
        } else {
            mensajeError.style.display = "none";
        }
    });
}

// Llamar a la función al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    validarInputBlur("miInput", 5);
});