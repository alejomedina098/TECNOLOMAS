let listaProductos = [];  
const Generos = [
    
    {tipo: 1, nombre: "PLACAS DE VIDEO", },
    {tipo: 2, nombre: "MOTHERBOARDS", },
    {tipo: 3, nombre: "MEMORIAS RAM", },
    {tipo: 4, nombre: "MICROPROCESADORES", },
    {tipo: 5, nombre: "GABINETES", },
    {tipo: 6, nombre: "DISCOS DUROS", },
]

const contenedorProductos = document.getElementById("contenedorProductos");
const contenedorFiltros = document.getElementById("contenedorFiltros");
const contadorCarrito = document.getElementById("cantidadArticulos");

let filtroActual;
let carrito = [];

function mostrarSweetAlert(mensaje){
    swal({
        text: mensaje,
        icon: "error",
        button: "Aceptar",
      })
}

function Filtros(){
    for (const dato of Generos) {
        let column = document.createElement("div");
        column.className = "col";
        column.id = "filtro-generos";
        column.innerHTML = `<a id="${dato.nombre}" class="link-filtro" href="#">${dato.nombre}</a>`;
        contenedorFiltros.append(column);
    }
}


function MostrarProductos(Genero){
    filtroActual = Genero;
    if (Genero =="Todos"){
        contenedorProductos.innerHTML = "";
        for (const dato of listaProductos) {
            let column = document.createElement("div");
                column.className = "col-sm-12 col-md-6 col-lg-3 pb-3";
                column.id = `columna-venta-${dato.id}`;
                column.innerHTML = `
                    <div class="card">
                    <img class="card-img-top w-100 card-img-top" src="img/${dato.imagen}" alt="Card image cap">
                        <div class="card-body">
                            <p class="card-text">Nombre: <b>${dato.nombre}</b></p>
                            <p class="card-text">Precio venta: <b>${dato.precioVenta}</b></p>
                            <p class="card-text" id="cant-${dato.id}">Cantidad: <b>${dato.cantidad}</b></p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary" id="${dato.id}" >Agregar</button>
                        </div>
                    </div>`;
                    contenedorProductos.append(column);
        }
    }else{
        listaProductos.map(function(dato){
            contenedorProductos.innerHTML = "";
            for (const dato of listaProductos) {
                if(dato.Tipo == Genero){
                    let column = document.createElement("div");
                    column.className = "col-md-4 mt-3 ";
                    column.id = `columna-venta-${dato.id}`;
                    column.innerHTML = `
                        <div class="card">
                        <img class="card-img-top w-100 card-img-top" src="img/${dato.imagen}" alt="Card image cap">
                            <div class="card-body">
                                <p class="card-text">Nombre: <b>${dato.nombre}</b></p>
                                <p class="card-text">Precio venta: <b>${dato.precioVenta}</b></p>
                                <p class="card-text" id="cant-${dato.id}">Cantidad: <b>${dato.cantidad}</b></p>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary" id="${dato.id}" >Agregar</button>
                            </div>
                        </div>`;
                        contenedorProductos.append(column);
                }
            }   
        });
    }
}


function eventoCarrito(seleccion){
    seleccion = parseInt(seleccion);
    listaProductos.map(function(dato){
        if(dato.id == seleccion){
            if (dato.cantidad > 0){
                let producto = listaProductos.find(articulo => articulo.id == seleccion);
                let repetido = carrito.find((x)=> x.id === producto.id);
                    if (repetido === undefined){
                    carrito.push({  id: producto.id,
                                    nombre: producto.nombre,
                                    precio: producto.precioVenta,
                                    cantidad: 1,});
                    }else{
                        repetido.cantidad += 1;
                    }
                dato.cantidad -= 1;
                mostrarToast(producto.nombre);
                actualizarProductosStorage();
            }else{
                mostrarSweetAlert("No quedan mas articulos");
            }
        }
    });

    actualizaContador(carrito);
    MostrarProductos(filtroActual);
}


function actualizaContador(datoCarrito){
    let total = 0;
    for (const dato of datoCarrito) {
        total += dato.cantidad;
    }
    cantidadArticulos.innerHTML = total;
}


function mostrarToast(articulo) {
    Toastify({
        text: articulo + " agregado",
        duration: 3000,
        close: true,
    }).showToast();
}


function inicializarEventos() {

    contenedorFiltros.onclick = (event) => MostrarProductos(event.target.id);
    contenedorProductos.onclick = (event) => eventoCarrito(event.target.id);
}





function obtenerProductosStorage() {
    let productosJSON = localStorage.getItem("carrito");
    if (productosJSON) {
        carrito = JSON.parse(productosJSON);
        actualizaContador(carrito);
    }
}


function actualizarProductosStorage() {
    let productosJSON = JSON.stringify(carrito);
    localStorage.setItem("carrito", productosJSON);
}




async function consultarProductosServer() {
    try {
      const response = await fetch(
        "output.json"
      );
      const data = await response.json();
      listaProductos = [...data];
      MostrarProductos("Todos");
    } catch (error) {
      console.log(error);
    }
  }





function main() {
    Filtros();
    consultarProductosServer();
    inicializarEventos();
    obtenerProductosStorage();
}

main();