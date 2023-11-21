import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        default: uuidv4,
        unique: true
    }, 
    purchase_datetime :{
        type: Date,
        default: Date.now
    },
    amount: Number,
    purchaser: String,
    products: []
});

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;