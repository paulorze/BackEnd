import { cartsModel }  from "../models/carts.model.js";
import Parent from "./parent.dao.js";
import Products from "./products.dao.js";
import Tickets from "./tickets.dao.js";

export default class Carts extends Parent{
    constructor () {
        super(cartsModel);
    };

    readByEmail = async (email) => {
        try {
            const user = await this.model.findOne({purchaser: email}).lean();
            if (!user) {
                return null;
            }
            return user;
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    deleteByMail = async (email) => {
        const cart = this.readByEmail(email);
        return this.delete(cart._id)
    }

    addCartProduct = async (email, pid, quantity) => {
        if (quantity <= 0 || isNaN(quantity)) throw new Error('Por favor, ingrese una cantidad valida.');
        const products = new Products();
        const productExists = products.readByID(pid);
        if (!productExists) throw new Error('Por favor, ingrese un producto valido.');
        const cart = await this.readByEmail(email);
        if (cart.products.some(product => product.id === pid)) {
            cart.products = cart.products.map(product => {
                if (product.id === pid) {
                    product.quantity += quantity;
                };
                return product;
            });
        } else {
            const newProduct = {pid, quantity};
            cart.products.push(newProduct);
        };
        try {
            const result = await this.update(cart._id, cart);
            return result;
        } catch{
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    deleteCartProduct= async (email, pid) => {
        const cart = await this.readByEmail(email);
        cart.products = cart.products.filter(product => product.pid.toString() !== pid);
        try {
            const result = await this.update(cart._id, cart);
            return result;
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    addCartProductsArray = async(email, products) => {
        const cart = await this.readByEmail(email);
        cart.products = products;
        try {
            const result = await this.update(cart._id, cart);
            return result;
        } catch{
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    completePurchase = async (email) => {
        const cart = await this.model.findOne({purchaser : email}).populate('products.pid');
        if (!cart.products || cart.products.length === 0) {
            throw new Error('400 BAD REQUEST: El carrito no tiene productos.');
        }
        const productsManager = new Products();
        let total = 0;
        let authorizedProducts = [];
        for (let i = 0; i < cart.products.length; i++) {
            const product = cart.products[i];
            try {
                if (product.pid.stock >= product.quantity) {
                    const subtotal = await productsManager.updateStock(product.pid, product.quantity);
                    total += subtotal;
                    const authorizedProduct = {id : product.pid._id.toString(), code: product.pid.code, price: product.pid.price}
                    authorizedProducts.push(authorizedProduct);
                    cart.products.splice(i, 1);
                    i--;
                } 
            } catch (e) {
                throw new Error('400 BAD REQUEST: El carrito no tiene productos.');
            };
        };
        const ticketsManager = new Tickets();
        const ticketObject = { amount : total, purchaser : email, products : authorizedProducts};
        try {
            await ticketsManager.create(ticketObject);
            return this.update(cart._id, cart);
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        }
    };
};