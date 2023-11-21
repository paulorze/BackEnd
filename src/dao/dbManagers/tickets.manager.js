import ticketsModel from "../models/tickets.model.js";
import Parent from "./parentClass.manager.js";

export default class Tickets extends Parent {
    
    constructor() {
        super(ticketsModel);
    };

};