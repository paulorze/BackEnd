import { messagesModel } from "../models/messages.model.js";
import Parent from "./parent.dao.js";

export default class Messages extends Parent {
    constructor () {
        super(messagesModel);
    };

    readByUser = async (user) => {
        try {
            const messages = await this.model.find({user}).lean();
            return messages;
        } catch {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };

    readConversation = async (user, sender) => {
        try {
            const messages = await this.model.find({user, sender}).lean();
            return messages;
        } catch (e) {
            throw new Error ('500 INTERNAL SERVER ERROR: Error al cargar los objetos.');
        };
    };
};