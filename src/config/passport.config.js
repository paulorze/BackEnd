import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { usersModel } from '../dao/models/users.model.js';

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

    // passport.use('github', new GitHubStrategy({
    //     clientID:'Iv1.f51b1612233b77bd',
    //     clientSecret:'7ac865738db707b319067c09e73087a570db8735',
    //     callbackURL:'http://localhost:8080/api/sessions/github-callback',
    //     scope: ['user:email']
    // }, async (accessToken, refreshToken, profile, done) => {
    //     try {
    //         const email = profile.emails[0].value;
    //         const user = await usersModel.findOne({email});
    //         if (!user) {
    //             const newUser = {
    //                 username: profile.username,
    //                 first_name: profile._json.name,
    //                 last_name: '',
    //                 age: '18',
    //                 email,
    //                 password: ''
    //             };
    //             const result = await usersModel.create(newUser);
    //             return done(null, result);
    //         } else {
    //             return done (null, user);
    //         };
    //     } catch (e) {
    //         return done(e);
    //     };
    // }));

    // passport.serializeUser((user, done) => {
    //     done(null, user._id);
    // });

    // passport.deserializeUser(async(id, done)=> {
    //     const user = await usersModel.findById(id);
    //     done(null, user);
    // });
};

export default initializePassport;