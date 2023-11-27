import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { login, logout, register, updateUserData, current } from "../controllers/users.controller.js";

export default class SessionsRouter extends Router {
    constructor(){
        super();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
        this.put('/updateUser', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, updateUserData);
        this.get('/logout', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, logout);
        this.get('/current', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, current);
    };

};