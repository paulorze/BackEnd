// Esto es para poder acceder a los archivos por su ubicacion sin problemas
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Esto es para hashear las passwords
import bcrypt from 'bcrypt';
// Esto es para las sesiones
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { PRIVATE_KEY_JWT } from './config/constants.js';

// Esto es para poder acceder a los archivos por su ubicacion sin problemas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

// Esto es para hashear las passwords
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (plainPassword, hashedPassword) => bcrypt.compareSync(plainPassword, hashedPassword);

// El siguiente codigo corresponde a la permanencia de la sesion del usuario
export const generateToken = (user)=> {
    const token = jwt.sign({user}, PRIVATE_KEY_JWT, {expiresIn: '24h'});
    return token;
};


// QUE PASA CON ESTO?
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({status: 'error', error: info.messages ? info.messages : info.toString()});
            };
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send({status: 'error', mesage: 'Your user role has no permissions.'});
        next();
    };
};