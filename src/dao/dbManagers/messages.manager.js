import { messagesModel } from "../models/messages.model.js";
import { ServerError } from "./errors.manager.js    ";

export default class Messages {
    constructor() {
    };

    getAll = async() => {
        try {            
            const messages = await messagesModel.find().lean();
            return messages;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    getAllLimit = async(limit)=>{
        if (isNaN(limit) || limit <= 0){
            throw new TypeError('Por favor, ingrese una cantidad de mensajes a mostrar valida.');
        };
        try {
            const messages = await messagesModel.find().sort({_id: -1}).limit(limit);
            return messages;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    getByID = async(mid)=> {
        try {
            const message = await messagesModel.find({_id: mid}).lean();
            if (!message) {
                throw new NotFoundError(`404 NOT FOUND: El mensaje con ID ${mid} no existe.`)
            };
            return message;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    addMessage = async (message)=> {
        try {
            const result = await messagesModel.create(message);
            return result;
        } catch (error) {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    deleteMessage = async (mid) => {
        try {
            const result = await messagesModel.deleteOne({_id: mid});
            return result;
        } catch (error) {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };
};