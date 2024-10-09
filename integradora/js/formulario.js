//formulario para agregar direcciones
let i = 1;
function agregarDireccion() {
    let info = document.getElementById("contDicc");
    
    info.innerHTML += `<div class="continuos" id="direccion${i}">
                <h3 class="full">dirección ${i}</h3>
                <input type="text" class="medio" name="calle" placeholder="Calle">
                <input type="text" class="medio" name="colonia" placeholder="Colonia">
                <input type="text" name="zona" class="cuarto" placeholder="zona">
                <input type="text" name="numeroEC" class="cuarto" placeholder="Numero Exterior">
                <input type="text" name="numeroIC" class="cuarto" placeholder="Numero Interior">
                <input type="text" name="CP" class="cuarto" placeholder="Codigo Postal">
                <button type="button" id="B_direcciones" onclick="eliminarDireccion(this)">Eliminar dirección</button>
            </div>`;
    i++;
}
function eliminarDireccion(button) {
    let direccion = button.parentNode; // Obtiene el div contenedor de la dirección
    direccion.remove(); // Elimina el div contenedor
}
