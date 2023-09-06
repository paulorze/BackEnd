import {promises as fs} from 'fs';
import {v4 as uuidv4} from 'uuid';
import { NotFoundError, ServerError, ValidationError } from "./ErrorManager.js";

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
            throw new ServerError('500 INTERNAL SERVER ERROR: No se pudieron obtener todos los productos. Se trabajara como si no existiera ninguno');
        };
    };

    async addProduct ({title, category, description, price, thumbnail  = null, code, stock}) {
        this.validateTitle(title);
        this.validateCategory(category);
        this.validateDescription(description);
        this.validateNumber(price, 'price');
        this.validateCode(code);
        this.validateNumber(stock, 'stock');
        const product = {
            id : uuidv4(),
            title,
            category,
            description,
            price,
            status: true,
            thumbnail: thumbnail? thumbnail : [],
            code,
            stock
        };
        this.#products.push(product);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, 4), 'UTF-8');
            return
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar el producto.');
        };
    };

    async updateProduct(id, data) {
        const foundProduct = this.getProductByID(id)
        const validKeys = ['title', 'category', 'description', 'price', 'thumbnail', 'code', 'stock']
        for (const [key, value] of Object.entries(data)) {
            if (!validKeys.includes(key)) throw new TypeError ('Por favor, ingrese solamente parametros validos (title, category, description, price, thumbnail, code, stock).');
        };
        for (const [key, value] of Object.entries(data)) {
            switch (key) {
                case 'title':
                    this.validateTitle(value);
                    break;
                case 'category':
                    this.validateCategory(value);
                    break;
                case 'description':
                    this.validateDescription(value);
                    break;
                case 'price':
                    this.validateNumber(value, 'price');
                    break;
                case 'code':
                    if (value != foundProduct.code) this.validateCode(value);
                    break;
                case 'stock':
                    this.validateNumber(value, 'code');
                    break;
            };
        };
        let updatedProduct;
        this.#products = this.#products.map(product =>{
            if (product.id === foundProduct.id) {
                for (const [key, value] of Object.entries(data)) {
                    product[key] = value;
                };
                updatedProduct = product;
            };
            return product;
        });
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, 4), 'UTF-8');
            return updatedProduct;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar el producto.');
        };
    };

    async deleteProduct(id){
        const foundProduct = this.getProductByID(id)
        this.#products = this.#products.filter(product => product.id !== foundProduct.id)
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, 4), 'UTF-8');
            return
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar el producto.');
        };
    };

    getProducts () {
        const productsData = this.#products;
        return productsData;
    };

    getProductsLimit (limit) {
        if (isNaN(limit) || limit <= 0) {
            throw new TypeError('Por favor, ingrese una cantidad de productos a ver valida.')
        } else {
            return this.#products.slice(0, limit);
        };
    };

    getProductByID (productID) {
        const productFound = this.#products.find(product => product.id === productID);
        if (!productFound) {
            throw new NotFoundError(`404 NOT FOUND: El producto con ID ${productID} no existe.`);
        } else {
            return productFound;
        };
    };

    validateTitle (string) {
        const titleRegEx= /^(?=.*[A-Za-z0-9'"()/áéíóúÁÉÍÓÚ])[\w\d\s'"()/áéíóúÁÉÍÓÚ]{5,40}$/;
        if (!titleRegEx.test(string.trim())) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: El título ingresado no es válido.`);
        }
    }

    validateCategory (category) {
        const validCategories = ['Bazaar', 'Herramientas', 'Electrodomésticos', 'Pequeños Electrodomésticos']
        if (!validCategories.includes(category)) {
            throw new ValidationError ('412 PRECONDITION FAILED ERROR: La categoría ingresada no es válida.');
        };
    };

    validateDescription (description) {
        const descriptionRegEx = /^(?=[\s\S]*[A-Za-z0-9'"()/.,;¡!¿?:\n\ráéíóúÁÉÍÓÚ])[\w\d\s'"()/.,;¡!¿?:\n\ráéíóúÁÉÍÓÚ]{50,400}$/;
        if (!descriptionRegEx.test(description.trim())) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: La descripción no cumple con los requisitos.(De 50 a 400 caracteres, solamente puede incluir letras, números, espacios, saltos de línea y los siguientes caracteres: ' " () / : `);
        }
    }

    validateNumber (num, param) {
        if (Number.isNaN(+num) || +num <= 0) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: El valor ingresado como ${param} no es un número válido. (Debe ser un número mayor a 0)`);
        }
    };

    validateCode (code) {
        const regEx = /^[A-Z]\d{3}$/;
        if (!regEx.test(code)) {
            throw new ValidationError ('412 PRECONDITION FAILED ERROR: El código ingresado no tiene formato válido. (Debe ser una letra mayúscula seguida de tres números)')
        };
        const existingCode = this.#products.find(product => product.code === code);
        if (existingCode) {
            throw new ValidationError ('412 PRECONDITION FAILED ERROR: El código ingresado ya fue utilizado en otro producto.')
        };
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