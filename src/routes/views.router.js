import {Router} from 'express';
import Carts from '../dao/dbManagers/carts.manager.js';
import Messages from '../dao/dbManagers/messages.manager.js';
import { productsModel } from '../dao/models/products.model.js';

const router = Router();

const cartsManager = new Carts();
const messagesManager = new Messages();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/user-profile');
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    next();
};

router.get('/', publicAccess, (req, res)=>{
    res.render('login', {
        style:'styles.css'
    });
});

router.get('/register', publicAccess, (req, res)=>{
    res.render('register', {
        style:'styles.css'
    });
});

router.get('/user-profile', privateAccess, (req, res)=>{
    let user = req.session.user;
    res.render('userprofile', {
        style:'styles.css',
        user
    });
});

router.get('/view-cart/:cid', privateAccess, async(req, res) => {
    const {cid} = req.params;
    try {
        const cart = await cartsManager.getByID(cid);
        res.render('carts', {
            title: "Carrito",
            style:'index.css',
            cart: cart});
    } catch (e) {
        res.status(500).send({status:'error', error: e.message})
    };
});

router.get('/view-messages', privateAccess, async (req, res)=>{
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
    const {limit = 10, page = 1, key, value, sort} = req.query;
    //Este primer if es medio innecesario salvo para orientar al usuario
    if ((key && !value) || (!key && value) || (key != 'category' && key != 'stock' && key != null)) return res.status(400).send({status: "error", error: "Por favor, ingrese un patrón de búsqueda válido."});
    if (sort && (sort != 1 && sort != -1)) return res.status(400).send({status: "error", error: "Por favor, ingrese una manera de ordenar válida."});
    const search = key && value ? {[key] : value} : {};
    const sortObj = sort ? {price : parseInt(sort)} : {};
    const user = req.session.user ? req.session.user : null;
    try {
        const {docs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(search, {limit, page, lean: true, sort: sortObj});
        res.render('products', {
            title: "Productos",
            style:'index.css',
            user,
            products: docs,
            totalPages,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage
            //nextLink y prevLink no son objetos que retorne el paginate. page rompe la carga de la pagina
        });
    } catch (e) {
        return res.status(500).send({status:'error', error: e.message});
    };
});

router.get('/product/:pid', async(req, res)=>{
    const {pid} = req.params;
    try {
        const {docs} = await productsModel.paginate({_id: pid}, {lean: true});
        const user = req.session.user ? req.session.user : null;
        res.render('product', {
            title: "Producto",
            style:'index.css',
            user,
            product: docs
        });
    } catch (e) {
        return res.status(500).send({status:'error', error: e.message});
    };
});

export default router;