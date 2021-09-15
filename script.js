const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment();
const template= document.querySelector('#template-card').content;
const templatecarrito = document.querySelector('#template-carrito').content
const templatefooter = document.querySelector('#template-footer').content

let carrito = {}

document.addEventListener('DOMContentLoaded' , () =>{
        api()
        if(localStorage.getItem('carrito')){
            carrito = JSON.parse(localStorage.getItem('carrito'))
            pintarCarrito()

        }

})
cards.addEventListener('click' , e =>{
    addcarrito(e)

})

items.addEventListener('click', e =>{
    btnAccion(e)


})

//--------------------------------------------------------




const api = async() =>{
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        pintacards(data)
        }catch(error){

            console.log(error)

        }
    }




//----------------------------------------------------------

const pintacards = data =>{
    data.forEach(element => {
        

        template.querySelector('h5').textContent = element.title;
        template.querySelector('p').textContent = element.precio;
        template.querySelector('img').setAttribute("src", element.thumbnailUrl)
        template.querySelector('.btn-dark').dataset.id = element.id
        const clone = document.importNode(template , true)

        fragment.appendChild(clone)
    
    })
    cards.appendChild(fragment)

}


const addcarrito = e =>{
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        //console.log(e.target.parentElement)
        setcarrito(e.target.parentElement)
    }
    e.stopPropagation()

}

const setcarrito = objeto =>{
    //console.log(objeto)
    const producto ={
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1


    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1

    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}


const pintarCarrito = () =>{

   // console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto=>{
        templatecarrito.querySelector('th').textContent = producto.id
        templatecarrito.querySelectorAll('td')[0].textContent = producto.title
        templatecarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templatecarrito.querySelector('.btn-info').dataset.id = producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id = producto.id
        templatecarrito.querySelector('span').textContent =producto.cantidad * producto.precio
        
        const clone = document.importNode(templatecarrito , true)
        fragment.appendChild(clone)

    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = ()=>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length ===0){
        footer.innerHTML =` <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio})=> acc + cantidad*precio,0)

    templatefooter.querySelectorAll('td')[0].textContent = nCantidad
    templatefooter.querySelector('span').textContent = nPrecio

    const clone = document.importNode(templatefooter , true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    
    const btnvaciar = document.getElementById('vaciar-carrito')
    btnvaciar.addEventListener('click' , ()=>{
        carrito = {}
        pintarCarrito()

    })
}

const  btnAccion = e=>{
    //console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        //carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if (e.target.classList.contains('btn-danger')){

        const producto=carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()


    }
    e.stopPropagation()

}