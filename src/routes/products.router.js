import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { deleteProductById, getAllProducts, getProductByID, newProduct, updateProduct } from '../controllers/products.controller.js';

export default class ProductsRouter extends Router {
    constructor () {
        super();
    };

    init() {
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllProducts);
        this.get('/:pid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getProductByID);
        this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, newProduct);
        this.put('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, updateProduct)
        this.delete('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteProductById);
    };
};