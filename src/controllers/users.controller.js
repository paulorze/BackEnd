import { createHash, generateToken, isValidPassword } from "../utils.js";
import { accessRolesEnum } from "../config/enums.js";
import { getUser, saveUser } from "../services/users.service.js";

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await getUser(email);
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

const register = async (req, res) => {
    const { username, first_name, last_name, age, email, password, role } = req.body;
    try {
        if (!username || !first_name || !last_name || !age || !email || !password || !role)
            return res.sendClientError("Valores incompletos. Falló el registro.");
        const exists = await getUser(email);
        console.log(getUser)
        if (exists) return res.sendClientError("El mail ingresado ya fue utilizado. Falló el registro.");
        const hashedPassword = createHash(password);
        const newUser = {...req.body};
        if (role !== accessRolesEnum.ADMIN) newUser.role = accessRolesEnum.USER;
        newUser.password = hashedPassword;
        const result = await saveUser(newUser);
        res.sendSuccess(result);
    } catch (e) {
        console.error();(e);
        res.sendServerError(e);
    };
};

const logout = (req, res) => {
    req.session.destroy((error)=> {
        if (error) return res.sendServerError("Fallo al cerrar sesión");
        res.redirect('/');
    });
};

export {
    login,
    register,
    logout
}