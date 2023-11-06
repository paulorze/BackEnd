import passport from 'passport';

import jwt from 'passport-jwt';
import { PRIVATE_KEY_JWT } from './constants.js';
import { passportStrategiesEnum } from './enums.js';

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