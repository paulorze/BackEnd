import { errorsEnum } from '../config/enums.js';
import CustomError from '../middlewares/errors/CustomError.js';
import { generateMissingIdErrorInfo, generateProductCreateErrorInfo, generateServerErrorInfo, generateUnauthorizedErrorInfo, generateUnhandledErrorInfo } from '../middlewares/errors/error.info.js';
import { getProducts, getProductById, saveProduct, deleteProduct, updateProduct } from '../services/products.service.js';
import { mockProduct } from '../utils.js';

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
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
            case errorsEnum.VALIDATION_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const getProduct = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Get Product Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to get product.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await getProductById(id);
        res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.DATABASE_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const newProduct = async (req, res) => {
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    if (!title || !category || !description || !code || !price || !stock) {
        throw CustomError.createError({
            name: 'Create Product Error',
            cause: generateProductCreateErrorInfo({title, category, description, code, price, stock}),
            message: 'Error trying to create new product.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
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
        switch (e.code) {
            case errorsEnum.VALIDATION_ERROR:
            case errorsEnum.DATABASE_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const updateProductById = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Update Product Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to update product.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    if (!title || !category || !description || !code || !price || !stock) {
        throw CustomError.createError({
            name: 'Update Product Error',
            cause: generateProductCreateErrorInfo({title, category, description, code, price, stock}),
            message: 'Error trying to update product.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const data = {title, category, description, code, price, stock, thumbnail};
    try {
        const result = await updateProduct(id, data);
        res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
            case errorsEnum.DATABASE_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const deleteProductById = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Delete Product Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to delete product.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await deleteProduct(id);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.DATABASE_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const mockProducts = (req, res) => {
    let products = [];
    for (let index = 0; index < 100; index++) {
        products.push(mockProduct());
    };
    res.send({
        status: 'ok',
        counter: products.length,
        data: products
    });
};

export {
    getAllProducts,
    getProduct,
    newProduct,
    updateProductById,
    deleteProductById,
    mockProducts
};