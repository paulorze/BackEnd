import { accessRolesEnum } from '../config/enums.js';
import { getUser, saveUser, updateUser } from '../services/users.service.js';
import { createHash, generateToken, isValidPassword } from '../utils.js';

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await getUser(email);
        if (!user) return res.status(500).send({ status: 'error', message: "todo mal aca error.message" });
        const comparePassword = isValidPassword(password, user.password);
        if (!comparePassword) return res.status(500).send({ status: 'error', message: "y aca error.message" });
        delete user.password;
        delete user.first_name;
        delete user.last_name;
        const accessToken = generateToken(user);
        res.cookie('session', accessToken, {maxAge: 60*60*1000, httpOnly: true}).send({ status: 'success', accessToken });  //?OJOACAAAAAA
    } catch (e) {
        res.status(500).send({ status: 'error', message: e.message });
    };
};

const register = async (req, res) => {
    const { username, first_name, last_name, email, password, role } = req.body;
    try {
        if (!username || !first_name || !last_name || !email || !password)
            res.status(500).send({ status: 'error', message: error.message });
        const exists = await getUser(email);
        if (exists) return res.status(500).send({ status: 'error', message: error.message });
        const hashedPassword = createHash(password);
        const newUser = {...req.body};
        if (role !== accessRolesEnum.ADMIN || role == null) newUser.role = accessRolesEnum.USER;
        newUser.password = hashedPassword;
        const result = await saveUser(newUser);
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: "por aca? error.message" });
    };
};

const updateUserData = async (req, res) => {
    const {id} = req.query;
    if (id != req.user._id) return res.status(500).send({ status: 'error', message: "nono error.message" });
    const { username, first_name, last_name, email, password, role } = req.body;
    const hashedPassword = createHash(password);
    const updatedUser = { username, first_name, last_name, email, password : hashedPassword, role };
    try {
        if (!username || !first_name || !last_name || !email || !password || !role)
            return res.status(500).send({ status: 'error', message: "aca error.message" });
        const result = updateUser(id, updatedUser);
        return res.send({ status: 'success', result });
    } catch (e) {
        return res.status(500).send({ status: 'error', message: "o aca e.message" });
    };
};

const logout = (req, res) => {
    delete req.user;
    res.clearCookie('session');
    res.redirect('/login');
};

const current = (req, res) => {
    res.send(req.user);
};

export {
    login,
    register,
    updateUserData,
    logout,
    current
};