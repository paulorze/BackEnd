import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getAllCarts, getCartByID, newCart, deleteCartById, addCartProducts, addCartProductById, deleteCartProductById } from '../controllers/carts.controller.js';

export default class CartsRouter extends Router {
    constructor () {
        super();
    };

    init() {
        this.get('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAllCarts);
        this.get('/:cid',[accessRolesEnum.USER], passportStrategiesEnum.JWT, getCartByID);
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, newCart);
        this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteCartById);
        this.put('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addCartProducts);
        this.put('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addCartProductById);
        this.delete('/:cid/products/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteCartProductById);
    };
};