import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getAllMessages, getMessageByID, newMessage, deleteMessageById } from '../controllers/messages.controller.js';
export default class MessagesRouter extends Router {
    constructor () {
        super();
    };

    init () {
        this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getAllMessages);
        this.get('/:mid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getMessageByID);
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, newMessage);
        this.delete('/:mid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteMessageById);
    };
};