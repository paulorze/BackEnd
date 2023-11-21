import passport from 'passport';
import dotenv from "dotenv";
import jwt from 'passport-jwt';
import { passportStrategiesEnum } from './enums.js';

dotenv.config();
const PRIVATE_KEY_JWT = process.env.PRIVATE_KEY_JWT;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use(passportStrategiesEnum.JWT, new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: PRIVATE_KEY_JWT
    }, async(jwt_payload, done)=> {
        try {
            return done(null, jwt_payload.user);
        } catch (e) {
            return done(e);
        };
    }));
};

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['sessionCookie']
    };
    return token;
}

export default initializePassport;