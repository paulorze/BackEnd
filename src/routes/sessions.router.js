import passport from "passport";
import Router from "./router.js";
import Users from "../dao/dbManagers/users.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";


export default class SessionsRouter extends Router {
    constructor(){
        super();
        this.usersManager = new Users();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register);
        this.get('/logout', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.logout);
        this.get('current', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.current);
    }

    async login (req, res) {
        const {email, password} = req.body;
        try {
            const user = await this.usersManager.getByEmail(email);
            if (!user) return res.sendClientError('Credenciales incorrectas. Falló el inicio de sesión.');
            const comparePassword = isValidPassword(password, user.password);
            if (!comparePassword) return res.sendClientError('Credenciales incorrectas. Falló el inicio de sesión.');
            delete user.password;
            const accessToken = generateToken(user);
            res.sendSuccess({ accessToken });
        } catch (e) {
            res.sendServerError(e.message);
        };
    };

    async register (req, res) {
        const { username, first_name, last_name, age, email, password, role } = req.body;
        try {
            if (!username || !first_name || !last_name || !age || !email || !password || !role)
                return res.sendClientError("Valores incompletos. Falló el registro.");
            const exists = await this.usersManager.getByEmail(email);
            if (exists) return res.sendClientError("El mail ingresado ya fue utilizado. Falló el registro.");
            const hashedPassword = createHash(password);
            const newUser = {...req.body};
            if (role !== accessRolesEnum.ADMIN) newUser.role = accessRolesEnum.USER;
            newUser.password = hashedPassword;
            const result = await this.usersManager.createUser(newUser);
            res.sendSuccess(result);
        } catch (e) {
            res.sendServerError(error.message);
        };
    };
    
    async logout (req, res) {
        req.session.destroy((error)=> {
            if (error) return res.sendServerError("Fallo al cerrar sesión");
            res.redirect('/');
        });
    };

    async current (req, res) {
        req.session
    }
};