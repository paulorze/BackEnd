import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getMessagesController, getMessageByIdController, saveMessageController, deleteMessageController } from "../controllers/messages.controller.js";

export default class MessagesRouter extends Router {
    constructor() {
        super();
    };

    init() {
        this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getMessagesController);
        this.get('/:id', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getMessageByIdController);
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, saveMessageController);
        this.delete('/:id', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteMessageController);
    };
};