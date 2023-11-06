import { getMessages, getMessageById, saveMessage, deleteMessage } from '../services/messages.service.js';
import {TypeError, ServerError, NotFoundError} from '../dao/dbManagers/errors.manager.js';

const getAllMessages = async (req, res) => {
    const {limit} = req.query;
    let messages = [];
    try {
        if (limit) {
            messages = await getMessages(limit);
        }else{
            messages = await getMessages();
        };
        res.sendSuccess(messages);
    } catch (e) {
        switch (true) {
            case (e instanceof TypeError):
                res.sendValidationError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

const getMessageByID = async (req, res) => {
    const {mid} = req.params;
    try {
        const message = await getMessageById(mid);
        res.sendSuccess(message);
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.sendNotFoundError(e.message);
                break;
            case (e instanceof ServerError):
                res.sendServerError(e.message);
                break;
            default:
                res.sendClientError(e.message);
        };
    };
};

const newMessage = async (req, res) => {
    const {user, message} = req.body;
    if (!user || !message) return res.sendClientError('El nombre de usuario y el cuerpo del mensaje son obligatorios.');
    const newMessage = {user, message};
    try {
        const result = await saveMessage(newMessage);
        res.sendSuccessNewResource(result);
    } catch (e) {
        res.sendClientError(e.message);
    };
};

const deleteMessageById = async (req, res) => {
    const {mid} = req.params;
    try {
        const result = await deleteMessage(mid);
        res.sendSuccess(result);
    } catch (e) {
        res.sendServerError(e.message);
    };
};

export {
    getAllMessages,
    getMessageByID,
    newMessage,
    deleteMessageById
};