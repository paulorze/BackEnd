import {Router} from 'express';
import Messages from '../dao/dbManagers/messages.manager.js';
import {TypeError, ServerError, NotFoundError} from '../dao/dbManagers/errors.manager.js';

const router = Router();
const messagesManager = new Messages();

router.get('/', async (req, res)=>{
    const {limit} = req.query;
    const messages = [];
    try {
        if (limit) {
            messages = await messagesManager.getAllLimit(limit);
        }else{
            messages = await messagesManager.getAll();
        };
        res.send({status: 'success', payload: messages});
    } catch (e) {
        switch (true) {
            case (e instanceof TypeError):
                res.status(412).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status.send({status: 'error', error: e.message});
        };
    };
});

router.get('/:mid', async (req, res)=> {
    const {mid} = req.params;
    try {
        const message = await messagesManager.getByID(mid);
        res.send({status: 'success', payload: message});
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.status(404).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status.send({status: 'error', error: e.message});
        };
    };
});

router.post('/', async (req, res)=>{
    const {user, message} = req.body;
    if (!user || !message) return res.status(400).send({status: 'error', error: 'El nombre de usuario y el cuerpo del mensaje son obligatorios.'});
    const newMessage = {user, message};
    try {
        const result = await messagesManager.addMessage(newMessage);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        res.status(500).send({status: 'error', error: e.message});
    };
});

router.delete('/:mid', async (req, res) => {
    const {mid} = req.params;
    try {
        const result = await messagesManager.deleteMessage(mid);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        res.status(500).send({status: 'error', error: e.message});
    };
});

export default router;