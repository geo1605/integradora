function addpopup() {
    let pop = document.getElementById("Popup");
    pop.style.display = "flex";

}
function colapsePopup() {
    let pop = document.getElementById("Popup");
    pop.style.display = "none";

}



let i = 1;
//formulario para agregar direcciones
function agregarDireccion() {
    let info = document.getElementById("contDicc");

    info.innerHTML += `<div class="continuos" id="direccion${i}">
                <h2>dirección ${i}</h2>
                <input type="text" class="medio" name="calle" placeholder="Calle">
                <input type="text" class="medio" name="colonia" placeholder="Colonia">
                <div class="contSel cuarto">
                    <select class="js-example-basic-single" name="state">
                        <option value="" selected disabled>Zona</option>
                        <option value="AL">Alabama</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>
                    
                <input type="text" name="numeroEC" class="cuarto" placeholder="Numero Exterior">
                <input type="text" name="numeroIC" class="cuarto" placeholder="Numero Interior">
                <input type="text" name="CP" class="cuarto" placeholder="Codigo Postal">
                <button type="button" id="B_direcciones" onclick="eliminarDireccion(this)">Eliminar dirección</button>
            </div>`;
    
    // Re-initialize Select2 for dynamically added elements
    $('.js-example-basic-single').select2();
    i++;
}

function eliminarDireccion(button) {
    let direccion = button.parentNode; // Obtiene el div contenedor de la dirección
    direccion.remove(); // Elimina el div contenedor
}
