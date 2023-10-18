import { cartsModel } from "../models/carts.model.js";
import { ServerError, NotFoundError, ValidationError } from "./errors.manager.js";

export default class Carts {
    constructor () {
    };

    getAll = async() => {
        try {
            const carts = await cartsModel.find().lean();
            return carts;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    getAllLimit = async(limit)=>{
        if (isNaN(limit) || limit <= 0){
            throw new TypeError('Por favor, ingrese una cantidad de carritos a mostrar valida.');
        };
        try {
            const carts = await cartsModel.find().sort({_id: -1}).limit(limit);
            return carts;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    getByID = async(id)=> {
        try {
            const cart = await cartsModel.find({_id: id}).lean();
            if (!cart) throw new NotFoundError(`404 NOT FOUND: El carrito con ID ${id} no existe.`)
            return cart;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    addCart = async (cart)=> {
        try {
            const result = await cartsModel.create(cart);
            return result;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    deleteCart = async (cid) => {
        try {
            const result = await cartsModel.deleteOne({_id: cid});
            return result;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al eliminar el carrito.');
        };
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
        //Aca se podria verificar si cada producto es de id valido y cantidad valida, pero creo que habria que crear una nueva instancia de productsManager y no se si sea conveniente
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