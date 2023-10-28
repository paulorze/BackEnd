import Router from './router.js';
import Carts from '../dao/dbManagers/carts.manager.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import {TypeError, ServerError, NotFoundError} from '../dao/dbManagers/errors.manager.js';

export default class CartsRouter extends Router {
    constructor () {
        super();
        this.cartsManager = new Carts();
    };

    init() {
        this.get('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.getAll);
        this.get('/:cid',[accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getByID);
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.newCart);
        this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteCart);
        this.put('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addCartProducts);
        this.put('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addCartProduct);
        this.delete('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteCartProduct);
    };

    async getAll (req, res) {
        const {limit} = req.query;
        let carts = [];
        try {
            if (limit) {
                carts = await this.cartsManager.getAllPaginated(limit);
            } else {
                carts = await this.cartsManager.getAll();
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

    async getByID (req, res) {
        const {cid} = req.params;
        try {
            const cart = await this.cartsManager.getByID(cid);
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

    async newCart (req, res) {
        const {products} = req.body;
        const cart = {products: products ? products : []};
        try {
            const result = await this.cartsManager.addCart(cart);
            res.sendSuccessNewResource(result);
        } catch (e) {
            res.sendServerError(e.message);
        };
    };

    async deleteCart (req, res) {
        const {cid} = req.params;
        try {
            const result = await this.cartsManager.deleteCart(cid);
            res.sendSuccess(result);
        } catch (e) {
            res.sendServerError(e.message);
        };
    };

    async addCartProducts (req, res) {
        const {cid} = req.params;
        const {products} = req.body;
        try {
            const result = await this.cartsManager.addCartProductsArray(cid, products);
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

    async addCartProduct (req, res) {
        const {cid, pid} = req.params;
        const {quantity} = req.body;
        if (!pid.trim() || !quantity.trim()){
            res.sendClientError('Por favor, ingrese todos los parametros necesarios (ID del producto y Cantidad)');
        };
        try {
            const result = await this.cartsManager.addCartProduct(cid, pid, quantity);
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

    async deleteCartProduct (req, res) {
        const {cid, pid} = req.params;
        if (!cid || !pid) {
            res.sendClientError('Por favor, ingrese todos los parametros necesarios(ID del carrito e ID del producto)');
        };
        try {
            const result = await this.cartsManager.deleteCartProduct(cid, pid);
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
};