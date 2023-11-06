import { cartsModel } from "../models/carts.model.js";
import { ServerError, ValidationError } from "./errors.manager.js";
import Parent from "./parentClass.manager.js";

export default class Carts extends Parent{
    constructor () {
        super(cartsModel)
    };

    addCartProduct = async (cid, pid, quantity) => {
        if (quantity <= 0 || isNaN(quantity)) throw new ValidationError('Por favor, ingrese una cantidad valida.');
        const cart = await this.getByID(cid);
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
            const result = await cartsModel.updateOne({_id: cid}, cart);
            return result;
        } catch{
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    deleteCartProduct= async (id, pid) => {
        const cart = await this.getByID(id);
        cart.products = cart.products.filter(product => product.id !== pid);
        try {
            const result = await cartsModel.updateOne({_id: id});
            return result;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    addCartProductsArray = async(cid, products) => {
        const cart = await this.getByID(cid);
        cart.products = products;
        try {
            const result = await cartsModel.updateOne({_id: cid}, cart);
            return result;
        } catch{
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    }
};