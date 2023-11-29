import { errorsEnum } from '../config/enums.js';
import CustomError from '../middlewares/errors/CustomError.js';
import { generateMissingIdErrorInfo, generateServerErrorInfo, generateTicketCreateErrorInfo, generateUnauthorizedErrorInfo, generateUnhandledErrorInfo } from '../middlewares/errors/error.info.js';

import { getTickets, getTicketById, saveTicket, deleteTicket } from '../services/tickets.service.js';

const getAllTickets = async (req, res) => {
    const {limit, page} = req.query;
    try {
        if (limit && page) {
            result = await getTickets(limit, page);
        } else {
            result = await getTickets();
        };
        res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
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

const getTicketByIDController = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Get Ticket Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to get ticket.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await getTicketById(id);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
            case errorsEnum.DATABASE_ERROR:
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

const saveTicketController = async (req, res) => {
    const {purchaser, amount, products} = req.body;
    if (!purchaser || !amount || !products) {
        throw CustomError.createError({
            name: 'Create Ticket Error',
            cause: generateTicketCreateErrorInfo({purchaser, amount, products}),
            message: 'Error trying to create ticket.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const ticket = {amount, purchaser, products};
    try {
        const result = await saveTicket(ticket);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
            case errorsEnum.DATABASE_ERROR:
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

const deleteTicketController = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw CustomError.createError({
            name: 'Delete Ticket Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to delete ticket.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await deleteTicket(id);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.NOT_FOUND_ERROR:
            case errorsEnum.VALIDATION_ERROR:
            case errorsEnum.DATABASE_ERROR:
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
    getAllTickets,
    getTicketByIDController,
    saveTicketController,
    deleteTicketController
}