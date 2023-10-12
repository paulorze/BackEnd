import {Router} from 'express';
import Carts from '../dao/dbManagers/carts.manager.js';
import {TypeError, ServerError, NotFoundError} from '../dao/dbManagers/errors.manager.js';

const router = Router();
const cartsManager = new Carts();

router.get('/', async(req, res) => {
    const {limit} = req.query;
    let carts = [];
    try {
        if (limit) {
            carts = await cartsManager.getAllLimit(limit);
        } else {
            carts = await cartsManager.getAll();
        };
        res.send({status: 'success', payload: carts});
    } catch (e) {
        switch (true) {
            case (e instanceof TypeError):
                res.status(412).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status(400).send({status: 'error', error: e.message});
        };
    };
});

router.get('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const cart = await cartsManager.getByID(cid);
        res.send({status: 'success', payload: cart});
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.status(404).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status(400).send({status: 'error', error: e.message});
        };
    };
});

router.post('/', async (req, res) => {
    const {products} = req.body;
    const cart = {products: products ? products : []};
    try {
        const result = await cartsManager.addCart(cart);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        res.status(500).send({status: 'error', error: e.message});
    };
});

router.delete('/:cid', async (req,res)=>{
    const {cid} = req.params;
    try {
        const result = await cartsManager.deleteCart(cid);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        res.status(500).send({status: 'error', error: e.message});
    };
});

router.put('/:cid', async (req, res)=>{
    const {cid} = req.params;
    const {products} = req.body;
    try {
        const result = await cartsManager.addCartProductsArray(cid, products);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.status(400).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status(400).send({status: 'error', error: e.message});
        };
    };
});

router.put('/:cid/products/:pid', async (req, res)=>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    if (!pid || !quantity){
        res.status(400).send({status: 'error', error: 'Por favor, ingrese todos los parametros necesarios (ID del producto y Cantidad)'});
    };
    try {
        const result = await cartsManager.addCartProduct(cid, pid, quantity);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.status(400).send({status: 'error', error: e.message});
                break;
            case (e instanceof ValidationError):
                res.status(412).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status(400).send({status: 'error', error: e.message});
        };
    };
});

router.delete('/:cid/products/:pid', async (req, res) =>{
    const {cid, pid} = req.params;
    if (!cid || !pid) {
        res.status(400).send({status: 'error', error: 'Por favor, ingrese todos los parametros necesarios(ID del carrito e ID del producto)'});
    }; //ESTO NO HACE FALTA, VERDAD?
    try {
        const result = await cartsManager.deleteCartProduct(cid, pid);
        res.status(200).send({status: 'success', payload: result});
    } catch (e) {
        switch (true) {
            case (e instanceof NotFoundError):
                res.status(400).send({status: 'error', error: e.message});
                break;
            case (e instanceof ServerError):
                res.status(500).send({status: 'error', error: e.message});
                break;
            default:
                res.status(400).send({status: 'error', error: e.message});
        };
    };
});

export default router;