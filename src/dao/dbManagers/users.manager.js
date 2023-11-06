import { usersModel } from "../models/users.model.js";

export default class Users {
    constructor(){
        this.model = usersModel;
    };

    getAll = async() => {
        try {            
            const userList = await this.model.find().lean();
            return userList;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    getByEmail = async(email) => {
        try {
            const user = await this.model.findOne({email}).lean();
            if (!user) {
                throw new NotFoundError(`404 NOT FOUND: El usuario no existe.`)
            };
            return user;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    save = async (user) => {
        try {
            const result = await this.model.create(user);
            return result;
        } catch (error) {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al guardar el objeto.');
        };
    };

    delete = async (id) => {
        try {
            const result = await this.model.deleteOne({_id: id});
            return result;
        } catch (error) {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al eliminar el objeto.');
        };
    };
};