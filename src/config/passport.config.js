import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { usersModel } from '../dao/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const {user_name, first_name, last_name, age} = req.body;
            const user_name_exists = await usersModel.findOne({username: user_name});
            const email_exists = await usersModel.findOne({email: username});
            if (user_name_exists || email_exists) {
                return done(null, false);
            };

            const user = await usersModel.create({
                username: user_name,
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            });

            return done(null, user);
        } catch (e) {
            return done(`Error al registrar el usuario: ${e.message}`);
        };
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await usersModel.findOne({email: username});

            if (!user) return done (null, false);

            if (!isValidPassword(password, user.password)) return done (null, false);

            return done (null, user);
        } catch (e) {
            return done(`Error durante el ingreso del usuario: ${e.message}`);
        };
    }));

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.f51b1612233b77bd',
        clientSecret:'7ac865738db707b319067c09e73087a570db8735',
        callbackURL:'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const user = await usersModel.findOne({email});
            if (!user) {
                const newUser = {
                    username: profile.username,
                    first_name: profile._json.name,
                    last_name: '',
                    age: '18',
                    email,
                    password: ''
                };
                const result = await usersModel.create(newUser);
                return done(null, result);
            } else {
                return done (null, user);
            };
        } catch (e) {
            return done(e);
        };
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done)=> {
        const user = await usersModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;