const socket = io();

const emitter = () =>{
    console.log('holis')
    const newProduct = {
        title : form.querySelector('#title').value,
        description : form.querySelector('#description').value,
        category : form.querySelector('#category').value,
        price : form.querySelector('#price').value,
        thumbnail : form.querySelector('#thumbnail').value,
        code : form.querySelector('#code').value,
        stock : form.querySelector('#stock').value
    };
    socket.emit('new-product', newProduct);
};

socket.on('update-products', newProducts =>{
    console.log('holis 2');
    const documentUL = document.getElementById('newlyAddedProducts');
    documentUL.innerHTML = "";
    if (newProducts && newProducts > 0) {
        newProducts.forEach(product => {
            const li = document.createElement("li");
            const titulo = document.createElement("h2");
            titulo.innerHTML("Producto: ", product.title);
            li.appendChild(titulo);
            const categoria = document.createElement("h4");
            categoria.innerHTML("Categoria: ", product.category);
            li.appendChild(categoria);
            const descripcion = document.createElement("h4");
            descripcion.innerHTML("Descripcion: ", product.description);
            li.appendChild(descripcion);
            const precio = document.createElement("h3");
            precio.innerHTML("Precio: $", product.price);
            li.appendChild(precio);
            const stock = document.createElement("h3");
            stock.innerHTML("Stock: ",product.stock, " ud.");
            li.appendChild(stock);
            const imagen = document.createElement("h2");
            imagen.setAttribute('src', product.thumbnail[0]);
            imagen.setAttribute('alt', product.title);
            li.appendChild(imagen);
            documentUL.appendChild(li);
        });
    };
})