import {Router} from 'express';
import Products from '../dao/dbManagers/products.manager.js';
import {TypeError, ServerError, NotFoundError, ValidationError} from '../dao/dbManagers/errors.manager.js';

const router = Router();
const productsManager = new Products();

router.get('/', async(req, res) => {
    const {limit} = req.query;
    let products = [];
    try {
        if (limit) {
            products = await productsManager.getAllLimit(limit);
        } else {
            products = await productsManager.getAll();
        };
        res.send({status: 'success', payload: products});
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

router.get('/:pid', async (req, res) => {
    const {pid} = req.params;
    try {
        const product = await productsManager.getByID(pid);
        res.send({status: 'success', payload: product});
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
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    if (!title || !category || !description || !code || !price || !stock) res.status(400).send({status: 'error', error: 'Por favor, ingrese todos los parametros necesarios (title, category, description, code, price, stock, thumbnail)'});
    const product = {
        title,
        category,
        description,
        code,
        price,
        stock,
        thumbnail: thumbnail ? thumbnail : []
    };
    try {
        const result = await productsManager.addProduct(product);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        switch (true) {
            case (e instanceof ValidationError):
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

router.put('/:pid', async (req, res)=>{
    const {pid} = req.params;
    const {title, category, description, code, price, stock, thumbnail} = req.body;
    const data = {title, category, description, code, price, stock, thumbnail};
    try {
        const result = await productsManager.updateProduct(pid, data);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        res.status(500).send({status: 'error', error: e.message});
    };
});

router.delete('/:pid', async (req,res)=>{
    const {pid} = req.params;
    try {
        const result = await productsManager.deleteProduct(pid);
        res.status(201).send({status: 'success', payload: result});
    } catch (e) {
        res.status(500).send({status: 'error', error: e.message});
    };
});

export default router;
