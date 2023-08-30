import {promises as fs} from 'fs';
import {v4 as uuidv4} from 'uuid';

class CartManager {
    #carts
    constructor ({path}) {
        this.#carts = [];
        this.path = path;
    };

    async init() {
        try {
            const cartsData = await fs.readFile(this.path, 'UTF-8');
            this.#carts = JSON.parse(cartsData);
        } catch {
            throw new Error ('No se pudieron obtener los carritos. Se trabajara como si no existiera ninguno')
        };
    };

    async saveCart({products = null}) {
        const cart = {
            id: uuidv4(),
            products: products ? products : []
        };
        this.#carts.push(cart);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#carts, null, 4), 'UTF-8');
            return
        } catch {
            throw new Error ('Error al guardar el carrito.');
        };
    };

    getCarts() {
        return this.#carts;
    };

    getCartsLimit (limit) {
        if (isNaN(limit) || limit <= 0) {
            throw new Error('Por favor, ingrese una cantidad de productos a ver valida.')
        } else {
            return this.#carts.slice(0, limit);
        }
    }

    getCartByID (cid) {
        const cartFound = this.#carts.find(cart => cart.id === cid);
        if (!cartFound) {
            throw new Error(`404 NOT FOUND: El carrito con ID ${cid} no existe.`);
        } else {
            return cartFound;
        };
    };

    async deleteCart(cid) {
        const cartFound = this.getCartByID(cid);
        this.#carts = this.#carts.filter(cart => cart.id !== cid);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#carts, null, 4), 'UTF-8');
            return;
        } catch (error) {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al eliminar el carrito.')
        };
    };

    async addProductToCart(cid, pid, quantity) {
        const cartFound = this.getCartByID(cid);
        if (cartFound.products.some(product => product.pid === pid)) {
            cartFound.products = cartFound.products.map(product => {
                if (product.pid === pid) {
                    product.quantity += quantity;
                };
                return product;
            });
        } else {
            const newProduct = {pid, quantity};
            cartFound.products.push(newProduct);
        };
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#carts, null, 4), 'UTF-8');
            return;
        } catch (error) {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al agregar el producto al carrito.')
        };
    };
};

export {CartManager};

// (async() => {
//     const cartManager = new CartManager({path: './src/carts.json'});
//     await cartManager.init();
//     await cartManager.saveCart();
//     console.log(cartManager.getCarts);
//     console.log(cartManager.getCartByID(2));
//     // console.log(cartManager.getCartByID(22));
//     await cartManager.deleteCart(10);
//     // await cartManager.deleteCart(15);
// })();