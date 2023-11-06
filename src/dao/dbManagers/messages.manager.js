import { messagesModel } from "../models/messages.model.js";
import Parent from "./parentClass.manager.js";

export default class Messages extends Parent {
    constructor() {
        super(messagesModel)
    };
};