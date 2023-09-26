import {Router} from 'express';
import Carts from '../dao/dbManagers/carts.manager.js';
import Messages from '../dao/dbManagers/messages.manager.js';
import Products from '../dao/dbManagers/products.manager.js';

const router = Router();

const cartsManager = new Carts();
const messagesManager = new Messages();
const productsManager = new Products()

router.get('/view-carts', async(req, res) => {
    try {
        const carts = await cartsManager.getAll();
        res.render('carts', {
            title: "Carritos",
            style:'index.css',
            carts: carts});
    } catch (e) {
        res.status(500).send({status:'error', error: e.message})
    };
});

router.get('/view-messages', async (req, res)=>{
    try {
        const messages = await messagesManager.getAll();
        res.render('chat', {
            title: "Chat",
            style:'index.css',
            messages: messages});
    } catch (e) {
        res.status(500).send({status:'error', error: e.message})
    };
});

router.get('/view-products', async(req, res) => {
    try {
        const products = await productsManager.getAll();
        res.render('products', {
            title: "Productos",
            style:'index.css',
            products: products});
    } catch (e) {
        res.status(500).send({status:'error', error: e.message})
    };
});

export default router;