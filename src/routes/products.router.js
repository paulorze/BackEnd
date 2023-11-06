import Router from './router.js';
import Products from '../dao/dbManagers/products.manager.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import {TypeError, ServerError, NotFoundError, ValidationError} from '../dao/dbManagers/errors.manager.js';

export default class ProductsRouter extends Router {
    constructor () {
        super();
        this.productsManager = new Products();
    };

    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.getAll);
        this.get('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.getByID);
        this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.newProduct);
        this.put('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.updateProduct)
        this.delete('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.deleteProduct);
    };

    async getAll (req, res) {
        const {limit} = req.query;
        let products = [];
        try {
            if (limit) {
                products = await this.productsManager.getAllPaginated(limit);
            } else {
                products = await this.productsManager.getAll();
            };
            res.sendSuccess(products);
        } catch (e) {
            res.sendServerError(e.message);
        };
    };

    async getByID (req, res) {
        const {pid} = req.params;
        try {
            const product = await this.productsManager.getByID(pid);
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

    async newProduct (req, res) {
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
            const result = await this.productsManager.addProduct(product);
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

    async updateProduct (req, res) {
        const {pid} = req.params;
        const {title, category, description, code, price, stock, thumbnail} = req.body;
        const data = {title, category, description, code, price, stock, thumbnail};
        try {
            const result = await this.productsManager.updateProduct(pid, data);
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

    async deleteProduct (req, res) {
        const {pid} = req.params;
        try {
            const result = await this.productsManager.deleteProduct(pid);
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
};