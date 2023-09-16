const socket = io();

const emitter = async (event) =>{
    //Prevenimos el submit por defecto
    event.preventDefault();
    //Tomamos los valores de los inputs de la form
    const form = event.target;
    const title = form.querySelector('#title').value;
    const description = form.querySelector('#description').value;
    const category = form.querySelector('#category').value;
    const price = form.querySelector('#price').value;
    const code = form.querySelector('#code').value;
    const stock = form.querySelector('#stock').value;
    //Creamos un objeto FormData y le agregamos todos las keys y values.
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('code', code);
    formData.append('stock', stock);
    const thumbnail = form.querySelector('#thumbnail');
    formData.append('thumbnail', thumbnail.files.length > 0 && thumbnail.files[0]);
    
    const response = await fetch('/realTimeProducts', {
        method: 'POST',
        body: formData,
    });
    socket.emit('new-product');
};

const onDelete = async (event) => {
    event.preventDefault();
    const form = event.target;
    const pid = form.querySelector('#pid').value;
    const response = await fetch(`/realTimeProducts/${pid}`, {
        method: 'DELETE'
    });
    socket.emit('new-product');
};

socket.on('update-products', newProducts =>{
    const documentUL = document.getElementById('newlyAddedProducts');
    documentUL.innerHTML = "";
    if (newProducts && newProducts.length > 0) {
        newProducts.forEach(product => {
            const li = document.createElement("li");
            const titulo = document.createElement("h2");
            titulo.innerHTML = "Producto: " + product.title;
            li.appendChild(titulo);
            const categoria = document.createElement("h4");
            categoria.innerHTML = "Categoria: " + product.category;
            li.appendChild(categoria);
            const descripcion = document.createElement("h4");
            descripcion.innerHTML = "Descripcion: " +  product.description;
            li.appendChild(descripcion);
            const precio = document.createElement("h3");
            precio.innerHTML = "Precio: $" + product.price;
            li.appendChild(precio);
            const stock = document.createElement("h3");
            stock.innerHTML = "Stock: " + product.stock +  " ud.";
            li.appendChild(stock);
            const imagen = document.createElement("img");
            imagen.setAttribute('src', product.thumbnail[0]);
            imagen.setAttribute('alt', product.title);
            li.appendChild(imagen);
            documentUL.appendChild(li);
        });
    };
});