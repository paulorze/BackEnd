import { getProducts, getProductById, saveProduct, deleteProduct, updateProductById } from '../services/products.service.js';
import {TypeError, ServerError, NotFoundError, ValidationError} from '../dao/dbManagers/errors.manager.js';

const getAllProducts = async (req, res) => {
    const {limit} = req.query;
    let products = [];
    try {
        if (limit) {
            products = await getProducts(limit);
        } else {
            products = await getProducts();
        };
        res.sendSuccess(products);
    } catch (e) {
        res.sendServerError(e.message);
    };
};

const getProductByID = async (req, res) => {
    const {pid} = req.params;
    try {
        const product = await getProductById(pid);
        res.sendSuccess(product);
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.sendNotFoundError(e.message);
                break;
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

const newProduct = async (req, res) => {
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    if (!title || !category || !description || !code || !price || !stock) return res.sendClientError('Por favor, ingrese todos los parametros necesarios (title, category, description, code, price, stock, thumbnail)');
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
        res.sendSuccessNewResource(result);
    } catch (e) {
        switch (true) {
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

const updateProduct = async (req, res) => {
    const {pid} = req.params;
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    const data = {title, category, description, code, price, stock, thumbnail};
    try {
        const result = await updateProductById(pid, data);
        res.sendSuccess(result);
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

const deleteProductById = async (req, res) => {
    const {pid} = req.params;
    try {
        const result = await deleteProduct(pid);
        res.sendSuccess(result);
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

export {
    getAllProducts,
    getProductByID,
    newProduct,
    updateProduct,
    deleteProductById
}