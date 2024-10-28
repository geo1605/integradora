function addpopup() {
    let pop = document.getElementById("addPopup");
    pop.style.display = "flex";

}
function colapsePopup(popupId) {
    let pop = document.getElementById(popupId);
    if (pop) {
        pop.style.display = "none";
    }
}



//updates
function updateEmp(id) {
    let name = document.getElementById(`nombre${id}`).innerText;
    let ApeP = document.getElementById(`apellidoP${id}`).innerText;  // Corregido a "apellidoP"
    let ApeM = document.getElementById(`apellidoM${id}`).innerText;

    let cargo = document.getElementById(`cargo${id}`).innerText;
    let correo = document.getElementById(`correo${id}`).innerText;
    let numero  = document.getElementById(`telefono${id}`).innerText;  // Corregido a "telefono"
    let estatus  = document.getElementById(`estatus${id}`).innerText;
    let cont = document.getElementById('upPopup');

    cont.innerHTML = `
        <form action="" class="modificacion" id="empleados">
            <h2>Editar empleado</h2>
            <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
            <input type="text" class="tercio" name="NombreC" placeholder="Nombre(s)" value="${name}">
            <input type="text" class="tercio" name="PaternoC" placeholder="Apellido Paterno" value="${ApeP}">
            <input type="text" class="tercio" name="MaternoC" placeholder="Apellido Materno" value="${ApeM}">
            <select class="tercio" name="cargo" id="cargo" value="${cargo}">
                <option value="empleado">empleado</option>
                <option value="admin">admin</option>
            </select>
            <input type="text" class="tercio" name="telefono" placeholder="telefono" value="${numero}">
            <select class="tercio" name="estatus" id="estatus" value="${estatus}">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
            </select>
            <input type="email" class="full" name="correo" placeholder="correo" value="${correo}">
            <input type="submit" class="full" value="Enviar">
        </form>`;

    cont.style.display = "flex";
}


function updateOrden(id) {
    let Id = document.getElementById(`ID${id}`).innerText;
    let fecha = document.getElementById(`fecha${id}`).innerText;
    let hora = document.getElementById(`hora${id}`).innerText;
    let estatus = document.getElementById(`estatus${id}`).innerText;
    let precio_total = document.getElementById(`precio_total${id}`).innerText;
    let id_cliente = document.getElementById(`ID_cliente${id}`).innerText;
    let id_detalle = document.getElementById(`ID_detalle${id}`).innerText;
    let id_empleado = document.getElementById(`ID_empleado${id}`).innerText;
    let tipo_pago = document.getElementById(`tipo_pago${id}`).innerText;
    let cont = document.getElementById('upPopup');

    cont.innerHTML = `<form action="" class="modificacion" id="orden">
                <h2>Editar orden</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="date" class="tercio" name="Fecha" value="${fecha}">
                <input type="time" class="tercio" name="Hora" value="${hora}">
                <select class="tercio" name="estatus" id="estatus" value="${estatus}">
                    <option value="activo">activo</option>
                    <option value="proceso">proceso</option>
                    <option value="cancelado">cancelado</option>
                </select>
                <input type="number" class="tercio" name="Precio_total" placeholder="Precio total" value="${precio_total}">
                <input type="number" class="tercio" name="ID_cliente" placeholder="ID cliente" value="${id_cliente}">
                <input type="number" class="tercio" name="ID_detalle" placeholder="ID detalle" value="${id_detalle}">
                <input type="number" class="tercio" name="ID_empleado" placeholder="ID empleado" value="${id_empleado}">
                <select class="tercio" name="tipo_pago" id="tipo_pago" value="${tipo_pago}">
                    <option value="Efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="deposito">Depósito</option>
                </select>
                <input type="submit" class="full" value="Enviar">
            </form>`;

    cont.style.display = "flex";
}

function updateCliente(id) {
    let Id = document.getElementById(`ID${id}`).innerText;
    let nombre = document.getElementById(`nombre${id}`).innerText;
    let ApeP = document.getElementById(`ApellidoP${id}`).innerText;
    let ApeM = document.getElementById(`ApellidoM${id}`).innerText;
    let telefono = document.getElementById(`telefono${id}`).innerText;
    let correo = document.getElementById(`correo${id}`).innerText;
    let estatus = document.getElementById(`estatus${id}`).innerText;
    let cont = document.getElementById('upPopup');

    cont.innerHTML = `<form action="" class="modificacion" id="cliente">
                <h2>Editar cliente</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="tercio" name="NombreC" placeholder="Nombre(s)" value="${nombre}">
                <input type="text" class="tercio" name="PaternoC" placeholder="Apellido Paterno" value="${ApeP}">
                <input type="text" class="tercio" name="MaternoC" placeholder="Apellido Materno" value="${ApeM}">
                <input type="text" class="medio" name="telefono" placeholder="telefono" value="${telefono}">
                <input type="email" class="medio" name="correo" placeholder="correo" value="${correo}">
                <select class="full" name="estatus" id="estatus" value="${estatus}">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
                <input type="submit" class="full" value="Enviar">
            </form>`;

    cont.style.display = "flex";
}

function updateProducto(id) {
    let Id = document.getElementById(`ID${id}`).innerText;
    let nombre = document.getElementById(`nombre${id}`).innerText;
    let tipo = document.getElementById(`tipo${id}`).innerText;
    let categoria = document.getElementById(`categoria${id}`).innerText;
    let precio = document.getElementById(`precio${id}`).innerText;
    let estatus = document.getElementById(`estatus${id}`).innerText;
    let cont = document.getElementById('upPopup');

    cont.innerHTML = `<form action="" class="modificacion" id="producto">
                <h2>Editar producto</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="full" name="Nombre" placeholder="Nombre" value="${nombre}">
                <div class="medio">
                <select class="js-example-basic-single" name="state" >
                    <option value="" disabled>categoría</option>
                    <option value="${categoria}" selected >${categoria}</option>
                    <option value="AL">Alabama</option>
                    <option value="WY">Wyoming</option>
                </select>
                </div>
                <select class="medio" name="tipo" id="tipo" value="${tipo}">
                    <option value="suelto">Suelto</option>
                    <option value="unitario">Unitario</option>
                </select>
                
                <input type="number" class="medio" name="precio" placeholder="Precio" value="${precio}">
                <select class="medio" name="estatus" id="estatus" value="${estatus}">
                    <option value="agotado">Agotado</option>
                    <option value="existente">Existente</option>
                </select>
                <input type="submit" class="full" value="Enviar">
            </form>`;

    cont.style.display = "flex";

    // Inicializar select2 después de que el contenido haya sido agregado
    $('.js-example-basic-single').select2();
}


function updateZona(id) {
    let Id = document.getElementById(`ID${id}`).innerText;
    let nombre_colonia = document.getElementById(`nombre_colonia${id}`).innerText;
    let costo_zona = document.getElementById(`costo_zona${id}`).innerText;
    let cont = document.getElementById('upPopup');

    cont.innerHTML = `<form action="" class="modificacion" id="zona">
                <h2>Editar zona</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="medio" name="nombre_colonia" placeholder="Nombre de la colonia" value="${nombre_colonia}">
                <input type="number" class="medio" name="costo_zona" placeholder="Costo de la zona" value="${costo_zona}">
                <input type="submit" class="full" value="Enviar">
            </form>`;

    cont.style.display = "flex";
}


function updateDireccion(id) {
    let Id = document.getElementById(`ID${id}`).innerText;
    let calle = document.getElementById(`calle${id}`).innerText;
    let num_ext = document.getElementById(`num_ext${id}`).innerText;
    let num_int = document.getElementById(`num_int${id}`).innerText;
    let colonia = document.getElementById(`colonia${id}`).innerText;
    let zona = document.getElementById(`zona${id}`).innerText;
    let cont = document.getElementById('upPopup');

    cont.innerHTML = `<form action="" class="modificacion" id="direccion">
                <h2>Editar dirección</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="tercio" name="calle" placeholder="Calle" value="${calle}">
                <input type="text" class="tercio" name="num_ext" placeholder="Número Exterior" value="${num_ext}">
                <input type="text" class="tercio" name="num_int" placeholder="Número Interior" value="${num_int}">
                <input type="text" class="medio" name="colonia" placeholder="Colonia" value="${colonia}">
                <div class="medio">
                <select class="js-example-basic-single" name="state" >
                    <option value="" disabled>categoría</option>
                    <option value="${zona}" selected >${zona}</option>
                    <option value="AL">Alabama</option>
                    <option value="WY">Wyoming</option>
                </select>
                </div>
                <input type="submit" class="full" value="Enviar">
            </form>`;

    cont.style.display = "flex";
    $('.js-example-basic-single').select2();
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
    
    $('.js-example-basic-single').select2();
    i++;
}

function eliminarDireccion(button) {
    let direccion = button.parentNode; // Obtiene el div contenedor de la dirección
    direccion.remove(); // Elimina el div contenedor
}
