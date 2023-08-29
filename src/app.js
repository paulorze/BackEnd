import { ProductManager } from "./ProductManager.js";
import { CartManager } from "./CartManager.js";
import express from 'express';
const app = express();

let productManager;
(async()=>{
    productManager = new ProductManager({path: './products.json'});
    await productManager.init();
    const cartManager = new CartManager({path: './carts.json'});
    await cartManager.init();
    
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    
    app.get('/products', (req, res)=> {
        const {limit} = req.query;
        if (!limit ) return res.send(productManager.getProducts());
        try {
            return res.send(productManager.getProductsLimit(limit));
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });
    
    app.get('/products/:pid', (req, res)=> {
        const pid = req.params.pid;
        try {
            return res.send(productManager.getProductByID(+pid));
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });

    app.post('/products', async (req, res)=> {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            return res.status(400).send({status: "error", error: "Por favor, ingrese todos los datos necesarios del producto (titulo, descripcion, precio, miniatura, codigo, stock)."});
        };
        try {
            await productManager.addProduct({title: product.title, description: product.description, price:product.price, thumbnail: product.thumbnail, code: product.code, stock: product.stock});
            return res.send({status: "success", message: "Producto agregado exitosamente."});
        } catch (e) {
            return res.status(400).send({status: "error", error: e.message});
        }
    });

    app.put('/products/:pid', async (req, res)=> {
        const pid = req.params.pid;
        let paramsToUpdate = req.body;
        try {
            await productManager.updateProduct(+pid, paramsToUpdate);
            return res.send({status: "success", message: "Producto actualizado exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });

    app.delete('/products/:pid', async (req, res)=> {
        const pid = req.params.pid;
        try {
            await productManager.deleteProduct(+pid);
            return res.send({status: "success", message: "Producto eliminado exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });

    app.get('/carts', (req, res)=> {
        const {limit} = req.query;
        if (!limit) return res.send(cartManager.getCarts());
        try {
            return res.send(cartManager.getCartsLimit(limit));
        } catch(error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });

    app.get('/carts/:cid', (req, res)=> {
        const cid = req.params.cid;
        try {
            return res.send(cartManager.getCartByID(+cid));
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });

    app.post('/carts', async (req, res)=> {
        const cart = req.body;
        try {
            await cartManager.saveCart({products: cart.products});
            return res.send({status: "success", message: "Carrito agregado exitosamente."});
        } catch (e) {
            return res.status(400).send({status: "error", error: e.message});
        }
    });

    app.put('/carts/:cid/products/:pid', async (req, res)=> {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        try {
            productManager.getProductByID(+pid);
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
            if (!quantity) return res.status(400).send({status: "error", error: "Por favor, ingrese la cantidad a agregar del producto."});
        try {
            await cartManager.addProductToCart(+cid, +pid, quantity);
            return res.send({status: "success", message: "Producto agregado al carrito exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });

    app.delete('/carts/:cid', async (req, res)=> {
        const cid = req.params.cid;
        try {
            await cartManager.deleteCart(+cid);
            return res.send({status: "success", message: "Carrito eliminado exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });

    app.listen(8080, ()=> {
        console.log('Servidor funcionando correctamente en el puerto 8080.')
    });
})();

