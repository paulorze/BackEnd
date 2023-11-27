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
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

};