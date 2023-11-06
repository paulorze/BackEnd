import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { login, logout, register } from "../controllers/users.controller.js";

export default class SessionsRouter extends Router {
    constructor(){
        super();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
        this.get('/logout', [accessRolesEnum.USER], passportStrategiesEnum.JWT, logout);
    }
};