import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getAllCarts, getCart, newCart, deleteCartByEmail, addCartProducts, addCartProductById, deleteCartProductById, purchase } from '../controllers/carts.controller.js';

export default class CartsRouter extends Router {
    constructor () {
        super();
    };

    init() {
        this.get('/all', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAllCarts);
        this.get('/',[accessRolesEnum.USER], passportStrategiesEnum.JWT, getCart);
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, newCart);
        this.put('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addCartProducts);
        this.delete('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteCartByEmail);
        this.put('/addProduct', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addCartProductById);
        this.delete('/deleteProduct', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteCartProductById);
        this.post('/purchase', [accessRolesEnum.USER], passportStrategiesEnum.JWT, purchase)
    };

};