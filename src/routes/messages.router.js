import Router from './router.js';
import Messages from '../dao/dbManagers/messages.manager.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import {TypeError, ServerError, NotFoundError} from '../dao/dbManagers/errors.manager.js';

export default class MessagesRouter extends Router {
    constructor () {
        super();
        this.messagesManager = new Messages();
    };

    init () {
        this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getAll);
        this.get('/:mid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getByID);
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.newMessage);
        this.delete('/:mid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteMessage);
    };

    async getAll(req, res) {
        const {limit} = req.query;
        let messages = [];
        try {
            if (limit) {
                messages = await this.messagesManager.getAllPaginated(limit);
            }else{
                messages = await this.messagesManager.getAll();
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

    async getByID (req, res) {
        const {mid} = req.params;
        try {
            const message = await this.messagesManager.getByID(mid);
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

    async newMessage (req, res) {
        const {user, message} = req.body;
        if (!user || !message) return res.sendClientError('El nombre de usuario y el cuerpo del mensaje son obligatorios.');
        const newMessage = {user, message};
        try {
            const result = await this.messagesManager.addMessage(newMessage);
            res.sendSuccessNewResource(result);
        } catch (e) {
            res.sendClientError(e.message);
        };
    };

    async deleteMessage (req, res) {
        const {mid} = req.params;
        try {
            const result = await messagesManager.deleteMessage(mid);
            res.sendSuccess(result);
        } catch (e) {
            res.sendServerError(e.message);
        };
    };
};