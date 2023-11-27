import { getTickets, getTicketById, saveTicket, deleteTicket } from '../services/tickets.service.js';

const getAllTickets = async (req, res) => {
    const {limit} = req.query;
    try {
        if (limit) {
            result = await getTickets(limit);
        } else {
            result = await getTickets();
        };
        res.send({ status: 'success', result });
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const getTicketByID = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await getTicketById(id);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const saveTicket = async (req, res) => {
    const {purchaser, amount, products} = req.body;
    const ticket = {amount, purchaser, products};
    try {
        const result = await saveTicket(ticket);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};

const deleteTicket = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await deleteTicket(id);
        res.send({ status: 'success', result }); 
    } catch (e) {
        res.status(500).send({ status: 'error', message: error.message });
    };
};