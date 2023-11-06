import { getCarts, getCartById, saveCart, deleteCart, addCartProduct, deleteCartProduct, addCartProductsArray } from '../services/carts.service.js';
import {TypeError, ServerError, NotFoundError} from '../dao/dbManagers/errors.manager.js';

const getAllCarts = async (req, res) => {
    const {limit} = req.query;
    let carts = [];
    try {
        if (limit) {
            carts = await getCarts(limit);
        } else {
            carts = await getCarts();
        };
        res.sendSuccess(carts);
    } catch (e) {
        switch (true) {
            case (e instanceof TypeError):
                res.sendValidationError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

const getCartByID = async (req, res) => {
    const {cid} = req.params;
    try {
        const cart = await getCartById(cid);
        res.sendSuccess(cart);
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.sendNotFoundError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

const newCart = async (req, res) => {
    const {products} = req.body;
    const cart = {products: products ? products : []};
    try {
        const result = await saveCart(cart);
        res.sendSuccessNewResource(result);
    } catch (e) {
        res.sendServerError(e.message);
    };
};

const deleteCartById = async (req, res) => {
    const {cid} = req.params;
    try {
        const result = await deleteCart(cid);
        res.sendSuccess(result);
    } catch (e) {
        res.sendServerError(e.message);
    };
};

const addCartProducts = async (req, res) =>  {
    const {cid} = req.params;
    const {products} = req.body;
    try {
        const result = await addCartProductsArray(cid, products);
        res.sendSuccessNewResource(result);
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.sendNotFoundError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

const addCartProductById = async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    if (!pid.trim() || !quantity.trim()){
        res.sendClientError('Por favor, ingrese todos los parametros necesarios (ID del producto y Cantidad)');
    };
    try {
        const result = await addCartProduct(cid, pid, quantity);
        res.sendSuccessNewResource(result);
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.sendNotFoundError(e.message);
                break;
            case (e instanceof ValidationError):
                res.sendValidationError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

const deleteCartProductById = async (req, res) => {
    const {cid, pid} = req.params;
    if (!cid || !pid) {
        res.sendClientError('Por favor, ingrese todos los parametros necesarios(ID del carrito e ID del producto)');
    };
    try {
        const result = await deleteCartProduct(cid, pid);
        res.sendSuccess(result);
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.sendNotFoundError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

export {
    getAllCarts,
    getCartByID,
    newCart,
    deleteCartById,
    addCartProducts,
    addCartProductById,
    deleteCartProductById
}