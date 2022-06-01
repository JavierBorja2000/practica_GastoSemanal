//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector("#gastos ul")

//Eventos
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto)
}

eventListeners()

//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((accum, gasto) => {
            return accum += gasto.cantidad
        }, 0)

        this.restante = this.presupuesto - gastado
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id)
        this.calcularRestante()
    }
}

class UI{
    insertarPresupuesto( cantidad ){
        const { presupuesto, restante } = cantidad
        document.querySelector("#total").textContent = presupuesto
        document.querySelector("#restante").textContent = restante
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement("div")
        divMensaje.classList.add('text-center', 'alert')

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }

        //SSe agrega el mensaje
        divMensaje.textContent = mensaje

        //Se inserta en el HTML
        document.querySelector(".primario").insertBefore(divMensaje, formulario)

        //Quitar alkerta del HTML
        setTimeout(() => {
            divMensaje.remove()
        },3000)
    }

    mostrarGastos(gastos){
        
        this.LimpiarHTML()

        // Iterar sobre los gastos
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto
        
            // Crear un LI
            const nuevoGasto = document.createElement("li")
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            nuevoGasto.dataset.id = id

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>`


            // Boton para borrar el gasto
            const btnBorrar = document.createElement("button")
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.textContent = 'Borrar'
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }

            nuevoGasto.appendChild(btnBorrar)

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        })
    }


    LimpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj
        
        const restanteDiv = document.querySelector('.restante')

        // Comprobar 25%
        if((presupuesto / 4) > restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')

        } else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')
        }

        // Si el total es menor o igual a 0
        if(restante <= 0){
            this.imprimirAlerta('El presupuesto se ha agotado', 'error')

            formulario.querySelector("button[type='submit']").disabled = true
        }
    }
}

let presupuesto
const ui = new UI()


//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Cual es tu presupuesto?")

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){
        window.location.reload()
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.insertarPresupuesto(presupuesto)
}
 

function agregarGasto(e){
    e.preventDefault()

    //leer losdatos del ofrmulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)


    //validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos Campos son Obligatorios', 'error')

        return
    } else if( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad No Valida', 'error')
    
        return
    }

    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now()}

    // Añadir Gasto
    presupuesto.nuevoGasto(gasto)

    //Mensaje todo bien!
    ui.imprimirAlerta('Gasto Agregado Correctamente')
    
    //Imprimir Gastos
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)
    // Reiniciar formulario
    formulario.reset()
}


function eliminarGasto(id){
    presupuesto.eliminarGasto(id)

    //elimina los gastos del HTML
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}