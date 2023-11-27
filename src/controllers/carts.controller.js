import { getCarts, getCartByEmail, saveCart, deleteCart, addCartProduct, deleteCartProduct, addCartProductsArray, completePurchase } from '../services/carts.service.js';

const getAllCarts = async (req, res) => {
    const {limit, page} = req.query;
    let result = [];
    try {
        if (limit && page) {
            result = await getCarts(limit);
        } else {
            result = await getCarts();
        };
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const getCart = async (req, res) => {
    const email = req.user.email;
    if (email != req.user.email) return res.status(500).send({ status: 'error', message: "nono, no hagas eso" });
    try {
        const result = await getCartByEmail(email);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const newCart = async (req, res) => {
    const cart = {purchaser: req.user.email, products: []};
    try {
        const result = await saveCart(cart);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: e.message });
    };
};

const deleteCartByEmail = async (req, res) => {
    const email = req.user.email;
    try {
        const result = await deleteCart(email);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const addCartProducts = async (req, res) =>  {
    const email = req.user.email;
    const {products} = req.body;
    try {
        const result = await addCartProductsArray(email, products);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: e.message });
    };
};

const addCartProductById = async (req, res) => {
    const email = req.user.email;
    const {pid, quantity} = req.body;
    if (!pid || !quantity){
        res.status(500).send({ status: 'error', message: error.message });
    };
    try {
        const result = await addCartProduct(email, pid, quantity);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const deleteCartProductById = async (req, res) => {
    const email = req.user.email;
    const {pid} = req.body;
    if (!pid) {
        res.status(500).send({ status: 'error', message: error.message });
    };
    try {
        const result = await deleteCartProduct(email, pid);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: e.message });
    };
};

const purchase = async (req, res) => {
    const email = req.user.email;
    try {
        const result = await completePurchase(email);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: e.message });
    }
}

export {
    getAllCarts,
    getCart,
    newCart,
    deleteCartByEmail,
    addCartProducts,
    addCartProductById,
    deleteCartProductById,
    purchase
};