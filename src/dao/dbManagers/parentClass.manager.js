import { ServerError, NotFoundError, TypeError } from "./errors.manager.js";

export default class Parent {
    constructor (model) {
        this.model = model
    };

    getAll = async() => {
        try {            
            const objectList = await this.model.find().lean();
            return objectList;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    getAllPaginated = async(limit)=>{
        if (isNaN(limit) || limit <= 0){
            throw new TypeError('Por favor, ingrese una cantidad a mostrar valida.');
        };
        try {
            const objectList = await this.model.paginate({}, {limit, page, lean: true});
            return objectList;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    getByID = async(id)=> {
        try {
            const object = await this.model.find({_id: id}).lean();
            if (!object) {
                throw new NotFoundError(`404 NOT FOUND: El objeto con ID ${id} no existe.`)
            };
            return object;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    save = async (object)=> {
        try {
            const result = await this.model.create(object);
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