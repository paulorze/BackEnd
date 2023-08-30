import { Router } from "express";
const router = Router();
import { ProductManager } from "../ProductManager.js";

(async()=> {
    const productManager = new ProductManager({path: './products.json'});
    await productManager.init();

    router.get('/', (req, res)=> {
        const {limit} = req.query;
        if (!limit ) return res.send({status: "success", payload: productManager.getProducts()});
        try {
            return res.send({status: "success", payload: productManager.getProductsLimit(limit)});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });
    
    router.get('/:pid', (req, res)=> {
        const pid = req.params.pid;
        try {
            return res.send({status: "success", payload: productManager.getProductByID(pid)});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        }
    });

    router.post('/', async (req, res)=> {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            return res.status(400).send({status: "error", error: "Por favor, ingrese todos los datos necesarios del producto (titulo, descripcion, precio, miniatura, codigo, stock)."});
        };
        try {
            await productManager.addProduct({title: product.title, description: product.description, price:product.price, thumbnail: product.thumbnail, code: product.code, stock: product.stock});
            return res.send({status: "success", message: "Producto agregado exitosamente."});
        } catch (e) {
            return res.status(400).send({status: "error", error: e.message});
        }
    });

    router.put('/:pid', async (req, res)=> {
        const pid = req.params.pid;
        let paramsToUpdate = req.body;
        try {
            await productManager.updateProduct(pid, paramsToUpdate);
            return res.send({status: "success", message: "Producto actualizado exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });

    router.delete('/:pid', async (req, res)=> {
        const pid = req.params.pid;
        try {
            await productManager.deleteProduct(pid);
            return res.send({status: "success", message: "Producto eliminado exitosamente."});
        } catch (error) {
            return res.status(400).send({status: "error", error: error.message});
        };
    });
})();



export default router;