import Carts from "../dao/dbManagers/carts.manager.js";

const cartsManager = new Carts();

const getCarts = async (limit = null) => {
    let carts;
    if (!limit == null) {
        carts = await cartsManager.getAllPaginated(limit);
    } else {
        carts = await cartsManager.getAll();
    };
    return carts;
};

const getCartById = async (id) => {
    return await cartsManager.getByID(id);
};

const saveCart = async (cart) => {
    return await cartsManager.save(cart);
};

const deleteCart = async (id) => {
    return await cartsManager.delete(id);
};

const addCartProduct = async (cid, pid, quantity) => {
    return await cartsManager.addCartProduct(cid, pid, quantity);
};

const deleteCartProduct = async (cid, pid) => {
    return await cartsManager.deleteCartProduct(cid, pid);
};

const addCartProductsArray = async (cid, products) => {
    return await cartsManager.addCartProductsArray(cid, products);
};

export {
    getCarts,
    getCartById,
    saveCart,
    deleteCart,
    addCartProduct,
    deleteCartProduct,
    addCartProductsArray
};