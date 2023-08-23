// const fs = require('fs/promises');
import {promises as fs} from 'fs';

class ProductManager {
    #products
    constructor ({path}) {
        this.#products = [];
        this.path = path;
    };

    async init() {
        try {
            const productsData = await fs.readFile(this.path, 'UTF-8');
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
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, 4), 'UTF-8');
            console.log('Producto agregado exitosamente.');
        } catch {
            console.log('Error al cargar el producto.');
        };
        return product;
    };

    async updateProduct(id, key, value) {
        const foundProduct = this.getProductByID(id)
        if (!foundProduct) return;
        const validKeys = ['all', 'title', 'description', 'price', 'thumbnai', 'code', 'stock']
        if (!validKeys.includes(key)) return console.log('Por favor, ingrese un parametro valido.');
        if(key === 'all') {
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
        } else{
            this.#products = this.#products.map(product =>{
                if (product.id === foundProduct.id) {
                    product[key] = value
                }
                return product 
            });
        };
        await fs.writeFile(this.path, JSON.stringify(this.#products, null, 4), 'UTF-8');
    };

    async deleteProduct(id){
        const foundProduct = this.getProductByID(id)
        if (!foundProduct) return;
        this.#products = this.#products.filter(product => product.id !== foundProduct.id)
        await fs.writeFile(this.path, JSON.stringify(this.#products, null, 4), 'UTF-8');
        console.log('Producto eliminado exitosamente.');
    };

    getProducts () {
        const productsData = this.#products;
        return productsData;
    };

    getProductsLimit (limit) {
        if (isNaN(limit) || limit <= 0) {
            throw new Error('Por favor, ingrese una cantidad de productos a ver valida.')
        } else {
            return this.#products.slice(0, limit);
        }
    }

    getProductByID (productID) {
        const productFound = this.#products.find(product => product.id === productID);
        if (!productFound) {
            throw new Error(`NOT FOUND: El producto con ID ${productID} no existe.`);
        } else {
            return productFound;
        }
    };
};

export {ProductManager};


// (async () =>{
//     const productManager = new ProductManager({path: './src/products.json'});
//     await productManager.init();
//     await productManager.addProduct({
//         title : 'Producto 5',
//         description : 'Producto nuevo y muy piola',
//         price : 200,
//         thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
//         code: 'P001',
//         stock: 20
//     });
//     await productManager.addProduct({
//         title : 'Producto 5',
//         description : 'Producto nuevo y muy piola',
//         thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
//         code: 'P005'
//     });
//     await productManager.addProduct({
//         title : 'Producto 11',
//         description : 'Producto nuevo y muy piola',
//         price : 200,
//         thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
//         code: 'P011',
//         stock: 20
//     });
//     let productsList = productManager.getProducts();
//     console.log(productsList);
//     const productoEncontradoFallido = productManager.getProductByID(12);
//     const productoEncontradoExitoso  = productManager.getProductByID(10);
//     console.log(productoEncontradoExitoso);
//     await productManager.deleteProduct(10);
//     productsList = productManager.getProducts();
//     console.log(productsList);
//     await productManager.updateProduct(9, 'asd', 'OTRO TITULO');
//     await productManager.updateProduct(9, 'title', 'OTRO TITULO');
//     await productManager.updateProduct(9, 'description', 'UNA COSA RE LOCA Y COPADA');
//     await productManager.updateProduct(9, 'price', 999999);
//     await productManager.updateProduct(9, 'code', 'P9999');
//     await productManager.updateProduct(9, 'stock', 9999999);
//     productsList = productManager.getProducts();
//     console.log(productsList);
//     await productManager.updateProduct(9, 'all', {
//         title: "Producto 10",
//         description: "Producto nuevo y muy piola",
//         price: 200,
//         thumbnail: "https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png",
//         code: "P010",
//         stock: 20
//     });
//     productsList = productManager.getProducts();
//     console.log(productsList);
// })();