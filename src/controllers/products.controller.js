import { getProducts, getProductById, saveProduct, deleteProduct, updateProduct } from '../services/products.service.js';

const getAllProducts = async (req, res) => {
    const {limit, page} = req.query;
    let result = [];
    try {
        if (limit && page) {
            result = await getProducts(limit, page);
        } else {
            result = await getProducts();
        };
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const getProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await getProductById(id);
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const newProduct = async (req, res) => {
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    if (!title || !category || !description || !code || !price || !stock) return res.status(500).send({ status: 'error', message: error.message });
    const product = {
        title,
        category,
        description,
        code,
        price,
        stock,
        thumbnail: thumbnail ? thumbnail : []
    };
    try {
        const result = await saveProduct(product);
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const updateProductById = async (req, res) => {
    const {id} = req.params;
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    const data = {title, category, description, code, price, stock, thumbnail};
    try {
        const result = await updateProduct(id, data);
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const deleteProductById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await deleteProduct(id);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

export {
    getAllProducts,
    getProduct,
    newProduct,
    updateProductById,
    deleteProductById
};