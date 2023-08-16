const fs = require('fs/promises');

class ProductManager {
    #products
    constructor () {
        this.#products = [];
    };

    async init() {
        try {
            const productsData = await fs.readFile('./products.js', 'UTF-8');
            this.#products = JSON.parse(productsData);
        } catch {
            console.log('No se pudieron obtener todos los productos. Se trabajara como si no existiera ninguno');
        };
    };

    async addProduct ({title, description, price, thumbnail, code, stock}) {
        const existingCode = this.#products.find(product => product.code === code);
        if (existingCode) {
            console.log('El codigo ingresado ya fue utilizado en otro producto.');
            return;
        };
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Por favor, ingrese todos los datos necesarios del producto (titulo, descripcion, precio, miniatura, codigo, stock).');
            return;
        };
        const product = {
            id : this.#products.length,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.#products.push(product);
        try {
            await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
            console.log('Producto agregado exitosamente.');
        } catch {
            console.log('Error al cargar el producto.');
        };
        return product;
    };

    async updateProduct(id, key, value) {
        const foundProduct = this.getProductByID(id)
        if (!foundProduct) return;
        switch (key) {
            case 'title':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, title : value}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Titulo del producto modificado de manera exitosa.')
                break;
            case 'description':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, description : value}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Descripcion del producto modificada de manera exitosa.')
                break;
            case 'price':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, price : value}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Precio del producto modificado de manera exitosa.')
                break;
            case 'thumbnail':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, thumbnail : value}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Miniatura del producto modificada de manera exitosa.')
                break;
            case 'code':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, code : value}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Codigo del producto modificado de manera exitosa.')
                break;
            case 'stock':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, stock : value}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Stock del producto modificado de manera exitosa.')
                break;
            case 'all':
                this.#products = this.#products.map(product =>{
                    if (product.id === foundProduct.id) {
                        return {...product, 
                            title: value.title,
                            description: value.description,
                            price: value.price,
                            thumbnail: value.thumbnail,
                            code: value.code,
                            stock : value.stock}
                    } else {
                        return product
                    };
                });
                await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
                console.log('Informacion del producto modificada de manera exitosa.')
                break;
            default:
                console.log('Por favor, ingrese un parametro a modificar valido.')
                break;
        }
    };

    async deleteProduct(id){
        const foundProduct = this.getProductByID(id)
        if (!foundProduct) return;
        this.#products = this.#products.filter(product => product.id !== foundProduct.id)
        await fs.writeFile('./products.js', JSON.stringify(this.#products, null, 4), 'UTF-8');
        console.log('Producto eliminado exitosamente.');
    };

    getProducts () {
        const productsData = this.#products;
        return productsData;
    };

    getProductByID (productID) {
        const productFound = this.#products.find(product => product.id === productID);
        if (!productFound) {
            console.log(`NOT FOUND: El producto con ID ${productID} no existe.`);
            return;
        } else {
            return productFound;
        }
    };
};



(async () =>{
    const productManager = new ProductManager();
    await productManager.init();
    await productManager.addProduct({
        title : 'Producto 5',
        description : 'Producto nuevo y muy piola',
        price : 200,
        thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
        code: 'P001',
        stock: 20
    });
    await productManager.addProduct({
        title : 'Producto 5',
        description : 'Producto nuevo y muy piola',
        thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
        code: 'P005'
    });
    await productManager.addProduct({
        title : 'Producto 5',
        description : 'Producto nuevo y muy piola',
        price : 200,
        thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
        code: 'P005',
        stock: 20
    });
    let productsList = productManager.getProducts();
    console.log(productsList);
    const productoEncontradoFallido = productManager.getProductByID(10);
    const productoEncontradoExitoso  = productManager.getProductByID(4);
    console.log(productoEncontradoExitoso);
    await productManager.deleteProduct(4);
    productsList = productManager.getProducts();
    console.log(productsList);
    await productManager.updateProduct(3, 'asd', 'OTRO TITULO');
    await productManager.updateProduct(3, 'title', 'OTRO TITULO');
    await productManager.updateProduct(3, 'description', 'UNA COSA RE LOCA Y COPADA');
    await productManager.updateProduct(3, 'price', 999999);
    await productManager.updateProduct(3, 'code', 'P9999');
    await productManager.updateProduct(3, 'stock', 9999999);
    productsList = productManager.getProducts();
    console.log(productsList);
    await productManager.updateProduct(3, 'all', {
        title: "Producto 4",
        description: "Producto nuevo y muy piola",
        price: 200,
        thumbnail: "https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png",
        code: "P004",
        stock: 20
    });
    productsList = productManager.getProducts();
    console.log(productsList);
})();