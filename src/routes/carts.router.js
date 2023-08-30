import { Router } from "express";
const router = Router();
import { ProductManager } from "../ProductManager.js";
import { CartManager } from "../CartManager.js";

(async()=>{
    const productManager = new ProductManager({path: './products.json'});
    await productManager.init();
    const cartManager = new CartManager({path: './carts.json'});
    await cartManager.init();

    router.get('/', (req, res)=> {
        const {limit} = req.query;
        if (!limit) return res.send({status: "success", payload: cartManager.getCarts()});
        try {
            return res.send({status: "success", payload:cartManager.getCartsLimit(limit)});
        } catch(error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });

    router.get('/:cid', (req, res)=> {
        const cid = req.params.cid;
        try {
            return res.send({status: "success", payload:cartManager.getCartByID(cid)});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });

    router.post('/', async (req, res)=> {
        const cart = req.body;
        try {
            await cartManager.saveCart({products: cart.products});
            return res.send({status: "success", message: "Carrito agregado exitosamente."});
        } catch (e) {
            return res.status(400).send({status: "error", error: e.message});
        }
    });

    router.put('/:cid/products/:pid', async (req, res)=> {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        try {
            productManager.getProductByID(pid);
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
        if (!quantity) {
            try {
                await cartManager.addProductToCart(cid, pid, 1);
                return res.send({status: "success", message: "Producto agregado al carrito exitosamente."});
            } catch (error) {
                return res.status(400).send({status: "error", error: error.message});
            };
        };
        try {
            await cartManager.addProductToCart(cid, pid, quantity);
            return res.send({status: "success", message: "Producto agregado al carrito exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });

    router.delete('/:cid', async (req, res)=> {
        const cid = req.params.cid;
        try {
            await cartManager.deleteCart(cid);
            return res.send({status: "success", message: "Carrito eliminado exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });
})();

export default router;