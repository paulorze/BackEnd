import { premiumKey } from "../../config/config.js";
import { errorsEnum } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateDatabaseErrorInfo, generateDocumentationErrorInfo } from "../../middlewares/errors/error.info.js";
import { usersModel } from "../models/users.model.js";
import Parent from "./parent.dao.js";

export default class Users extends Parent {
    constructor () {
        super(usersModel);
    };

    readByEmail = async (email) => {
        try {
            const user = await this.model.findOne({email}).lean();
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    recategorize = async (id) => {
        const user = await this.readByID(id);
        if (user.role === 'USER') {
            const hasIdentificacion = user.documents.some(doc => doc.name === 'Identificacion');
            const hasDomicilio = user.documents.some(doc => doc.name === 'Comprobante de domicilio');
            const hasCuenta = user.documents.some(doc => doc.name === 'Comprobante de estado de cuenta');
            if (!hasIdentificacion || !hasDomicilio || !hasCuenta) {
                throw CustomError.createError({
                    name: 'Documentation Error',
                    cause: generateDocumentationErrorInfo(),
                    message: 'Error trying recategorize user.',
                    code: errorsEnum.VALIDATION_ERROR
                });
            };
            user.role = premiumKey;
        } else {
            user.role = 'USER';
        };
        try {
            return this.update(id, user);
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    updateLastConnectionRepo = async (email) => {
        try {
            const user = await this.readByEmail(email);
            const updatedUser = {...user, last_connection: Date.now()};
            return await this.update(updatedUser._id, updatedUser);
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        }
    };

    
};