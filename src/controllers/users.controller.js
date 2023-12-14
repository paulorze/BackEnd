import { accessRolesEnum, errorsEnum } from '../config/enums.js';
import CustomError from '../middlewares/errors/CustomError.js';
import { generateMissingEmailErrorInfo, generateMissingIdErrorInfo, generateMissingPasswordErrorInfo, generatePasswordResetErrorInfo, generateUnauthorizedErrorInfo, generateUnhandledErrorInfo, generateUserConflictErrorInfo, generateUserCreateErrorInfo, generateUserLoginErrorInfo } from '../middlewares/errors/error.info.js';
import { sendEmail } from '../services/mails.service.js';
import { getUser, recategorizeUser, saveUser, updateUser } from '../services/users.service.js';
import { createHash, generateToken, isValidPassword, passwordResetTokenVerification } from '../utils.js';

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        req.logger.info('Unauthorized Error: Incorrect credentials.');
        throw CustomError.createError({
            name: 'Login Error',
            cause: generateUserLoginErrorInfo(),
            message: 'Error trying to login.',
            code: errorsEnum.UNAUTHORIZED_ERROR
        });
    }
    try {
        const user = await getUser(email);
        if (!user) {
            req.logger.info('Unauthorized Error: Incorrect credentials.');
            throw CustomError.createError({
                name: 'Login Error',
                cause: generateUserLoginErrorInfo(),
                message: 'Error trying to login.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        const comparePassword = isValidPassword(password, user.password);
        if (!comparePassword) {
            req.logger.info('Unauthorized Error: Incorrect credentials.');
            throw CustomError.createError({
                name: 'Login Error',
                cause: generateUserLoginErrorInfo(),
                message: 'Incorrect Credentials.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        delete user.password;
        delete user.first_name;
        delete user.last_name;
        const accessToken = generateToken(user, '24h');
        res.cookie('session', accessToken, {maxAge: 60*60*1000, httpOnly: true}).send({ status: 'success', accessToken });  //?OJOACAAAAAA
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            case errorsEnum.UNAUTHORIZED_ERROR:
                req.logger.info('Authentication Error: Incorrect Credentials.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const register = async (req, res) => {
    const { username, first_name, last_name, email, password, role } = req.body;
    if (!username || !first_name || !last_name || !email || !password) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Create User Error',
            cause: generateUserCreateErrorInfo({username, first_name, last_name, email, password}),
            message: 'Error trying to create new user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const exists = await getUser(email);
        if (exists) {
            req.logger.info('Conflict Error: Trying To Register Existing Email.');
            throw CustomError.createError({
                name: 'Existing Email Error',
                cause: generateUserConflictErrorInfo(email),
                message: 'The mail is already in use.',
                code: errorsEnum.CONFLICT_ERROR
            });
        };
        // PASAR HASHEO DE PASSWORD A LA CAPA DE SERVICIOS
        const hashedPassword = createHash(password);
        const newUser = {...req.body};
        if (role !== accessRolesEnum.ADMIN || role == null) newUser.role = accessRolesEnum.USER;
        newUser.password = hashedPassword;
        const result = await saveUser(newUser);
        res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const updateUserData = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Update User Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to update user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    if (id != req.user._id) {
        req.logger.error('Unauthorized Access Error: Unauthorized User Trying To Access Priviliged Functions.');
        throw CustomError.createError({
            name: 'Unauthorized Access Error',
            cause: generateUnauthorizedErrorInfo(),
            message: 'You have no permissions to access the requested resource.',
            code: errorsEnum.UNAUTHORIZED_ERROR
        });
    };
    const { username, first_name, last_name, email, password } = req.body;
    if (!username || !first_name || !last_name || !email || !password){
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Update User Error',
            cause: generateUserCreateErrorInfo({username, first_name, last_name, email, password}),
            message: 'Error trying to update user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const hashedPassword = createHash(password);
    const updatedUser = { username, first_name, last_name, email, password : hashedPassword, role: req.user.role };
    try {
        const result = updateUser(id, updatedUser);
        return res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
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

const recategorize = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Update User Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to update user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await recategorizeUser(id);
        return res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const requestPasswordReset = async (req, res) => {
    const {token} = req.query;
    if (token) {
        const decodedToken = passwordResetTokenVerification(token);
        if (!decodedToken) {
            req.logger.info('Unauthorized Error: Incorrect credentials.');
            throw CustomError.createError({
                name: 'Login Error',
                cause: generateUserLoginErrorInfo(),
                message: 'Invalid JWT.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        const { password } = req.body;
        if (!password) {
            req.logger.warning('Missing Values Error: Expected Parameter (Password) Is Missing.');
            throw CustomError.createError({
                name: 'Reset Password Error',
                cause: generateMissingPasswordErrorInfo(),
                message: 'Error trying to reset password.',
                code: errorsEnum.INCOMPLETE_VALUES_ERROR
            });
        };
        const email = decodedToken.user.email;
        try {
            const user = await getUser(email);
            const samePassword = isValidPassword(password, user.password);
            if (samePassword) {
                req.logger.info('Same Password Error: New Password is Equal to Old Password.');
                throw CustomError.createError({
                    name: 'Reset Password Error',
                    cause: generatePasswordResetErrorInfo(),
                    message: 'New Password is Equal to Old Password.',
                    code: errorsEnum.INCOMPLETE_VALUES_ERROR
                });
            };
            const hashedPassword = createHash(password);
            user.password = hashedPassword;
            const result = await updateUser(user._id, user);
            return res.send({status:'success', message: 'Your Password Was Reseted Successfully'});
        } catch (e) {
            switch (e.code) {
                case errorsEnum.DATABASE_ERROR:
                    req.logger.fatal('Fatal Error: Database Failure.');
                    throw e
                case errorsEnum.NOT_FOUND_ERROR:
                    req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                    throw e
                case errorsEnum.VALIDATION_ERROR:
                    req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                    throw e;
                default:
                    req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: e.message,
                        code: errorsEnum.UNHANDLED_ERROR
                });
            };
        };
    } else {
        const {email} = req.body;
        if (!email) {
            req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
            throw CustomError.createError({
                name: 'Reset Password Error',
                cause: generateMissingEmailErrorInfo(),
                message: 'Error trying to reset password.',
                code: errorsEnum.INCOMPLETE_VALUES_ERROR
            });
        };
        try {
            const user = await getUser(email);
            if (!user) {
                req.logger.info('Unauthorized Error: Incorrect credentials.');
                throw CustomError.createError({
                    name: 'Login Error',
                    cause: generateUserLoginErrorInfo(),
                    message: 'Invalid Credentials.',
                    code: errorsEnum.UNAUTHORIZED_ERROR
                });
            };
            delete user.password;
            delete user.first_name;
            delete user.last_name;
            user.role = 'PASSWORDRESET';
            const accessToken = generateToken(user, '1h');
            const result = await sendEmail(email, accessToken);
            return res.send({status: 'success', result});
        } catch (e) {
            switch (e.code) {
                case errorsEnum.DATABASE_ERROR:
                    req.logger.fatal('Fatal Error: Database Failure.');
                    throw e
                case errorsEnum.NOT_FOUND_ERROR:
                    req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                    throw e
                case errorsEnum.VALIDATION_ERROR:
                    req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                    throw e;
                default:
                    req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: e.message,
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };
};

export {
    login,
    register,
    updateUserData,
    logout,
    current,
    recategorize,
    requestPasswordReset
};