import { errorsEnum } from '../config/enums.js';
import CustomError from '../middlewares/errors/CustomError.js';
import { generateMessageCreateErrorInfo, generateMissingEmailErrorInfo, generateMissingIdErrorInfo } from '../middlewares/errors/error.info.js';
import { getMessages, getMessageById, saveMessage, deleteMessage } from '../services/messages.service.js'

const getMessagesController = async(req, res) => {
    const user = req.user.email;
    const {receiver} = req.query;
    if (!user) {
        throw CustomError.createError({
            name: 'Get Messages Error',
            cause: generateMissingEmailErrorInfo(),
            message: 'Error trying to get messages.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = getMessages(user, receiver);
        return res.send({status: 'success', result});
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const getMessageByIdController = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Get Message Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to get message.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = getMessageById(id);
        return res.send({status: 'success', result});
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const saveMessageController = async (req, res) => {
    const user = req.user.email;
    const {receiver, message} = req.body;
    if (!user || !receiver || !message) {
        throw CustomError.createError({
            name: 'Create Message Error',
            cause: generateMessageCreateErrorInfo({user, receiver, message}),
            message: 'Error trying to create new message.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = saveMessage({user, receiver, message});
        return res.send({status: 'success', result});
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const deleteMessageController = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Delete Message Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to delete message.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = deleteMessage(id);
        return res.send({status: 'success', result});
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
                throw e;
            default:
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

export {
    getMessagesController,
    getMessageByIdController,
    saveMessageController,
    deleteMessageController
};