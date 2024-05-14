const socket = io();
const products = [{ stock: 0 }, { stock: 1 }]
const form = document.getElementById('addProduct')
const catalogue = document.getElementById('catalogue')

// Conexión establecida con el servidor
socket.on('connect', () => {
    console.log('Conexión establecida con el servidor');
});

// Captura de campos del formulario, envío de evento para agregar producto y borrado del contenido de los campos del formulario
form.addEventListener('submit', ev => {
    console.log('addevent')
    ev.preventDefault()
    const newProduct = {
        title: ev.target.title.value,
        thumbnail: ev.target.thumbnail.value,
        description: ev.target.description.value,
        code: ev.target.code.value,
        price: ev.target.price.value,
        status: ev.target.status.value,
        stock: ev.target.stock.value,
        category: ev.target.category.value 
    }
    socket.emit('add_product', newProduct)
    form.reset()
})

// Escucha del evento para renderizar lista de productos
socket.on('products', (data) => {
    console.log('Datos recibidos:', data);
    if (data && Array.isArray(data.products)) {
        while (catalogue.firstChild) {
            catalogue.removeChild(catalogue.firstChild);
        }
        data.products.forEach((product) => {
            const content = `<div class="text-center card" style="width: 16rem; margin: 10px">
                <div class="card-header">Categoría: ${product.category}</div>
                <div class="card-body">
                    <div class="card-title h5">${product.title}</div>
                    <div class="mb-2 text-muted card-subtitle h6">Precio: $${product.price}</div>
                    <p class="card-text">${product.description}</p>
                </div>
                <div class="text-muted card-footer">Stock disponible: ${product.stock} unidades</div>
            </div>`;
            catalogue.innerHTML += content;
        })
    } else {
        console.error('La propiedad "products" no es un array:', data.products);
    }
});

// Escucha del evento de confirmación de producto agregado
socket.on('success', () => {
    console.log('producto agregado con éxito')
    Swal.fire({
        title: "¡Agregado!",
        text: "Se agregó correctamente el producto",
        icon: 'success'
    });
})

// Escucha del evento de error al agregar producto
socket.on('error', () => {
    console.log('no se agregó')
    Swal.fire({
        title: '¡Ups!',
        text: "No se pudo agregar el producto",
        icon: 'error'
    });
})


