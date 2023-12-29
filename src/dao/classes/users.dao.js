import { premiumKey } from "../../config/config.js";
import { errorsEnum } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateDatabaseErrorInfo } from "../../middlewares/errors/error.info.js";
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
        } catch {
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
        user.role = user.role === premiumKey ? 'USER' : premiumKey;
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

};