import { Router } from "express";
import { uploader } from "../utils.js";
import { ProductManager } from "../ProductManager.js";
import { NotFoundError, ServerError, ValidationError } from "../ErrorManager.js";

const router = Router();

(async()=> {
    const productManager = new ProductManager({path: './products.json'});
    await productManager.init();

    router.get('/', (req, res)=> {
        const {limit} = req.query;
        if (!limit ) return res.send({status: "success", payload: productManager.getProducts()});
        try {
            return res.send({status: "success", payload: productManager.getProductsLimit(limit)});
        } catch (error) {
            return res.status(412).send({status: "error", error: error.message});
        }
    });
    
    router.get('/:pid', (req, res)=> {
        const pid = req.params.pid;
        try {
            return res.send({status: "success", payload: productManager.getProductByID(pid)});
        } catch (error) {
            return res.status(404).send({status: "error", error: error.message});
        }
    });

    router.post('/', uploader.single('thumbnail'), async (req, res)=> {
        if (!req.file) {
            return res.status(428).send({status: 'error', error: 'Por favor, elija una imagen de formato valido.'})
        }
        const product = req.body;
        if (!product.title || !product.category || !product.description || !product.price || !product.code || !product.stock) {
            return res.status(428).send({status: "error", error: "Por favor, ingrese todos los datos necesarios del producto (titulo, descripcion, precio, miniatura, codigo, stock)."});
        };
        try {
            await productManager.addProduct({title: product.title, category: product.category, description: product.description, price:product.price, thumbnail: req.file.path, code: product.code, stock: product.stock});
            return res.send({status: "success", message: "Producto agregado exitosamente."});
        } catch (e) {
            switch (true) {
                case (e instanceof ValidationError):
                    return res.status(412).send({status: "error", error: e.message});
                    break;
                case (e instanceof ServerError):
                    return res.status(500).send({status: "error", error: e.message});
                    break;
            }
        }
    });

    router.put('/:pid', async (req, res)=> {
        const pid = req.params.pid;
        let paramsToUpdate = req.body;
        try {
            await productManager.updateProduct(pid, paramsToUpdate);
            return res.send({status: "success", message: "Producto actualizado exitosamente."});
        } catch (error) {
            switch (true) {
                case (e instanceof NotFoundError):
                    return res.status(404).send({status: "error", error: e.message});
                    break;
                case (e instanceof ValidationError):
                    return res.status(412).send({status: "error", error: e.message});
                    break;
                case (e instanceof ServerError):
                    return res.status(500).send({status: "error", error: e.message});
                    break;
            }
        };
    });

    router.delete('/:pid', async (req, res)=> {
        const pid = req.params.pid;
        try {
            await productManager.deleteProduct(pid);
            return res.send({status: "success", message: "Producto eliminado exitosamente."});
        } catch (error) {
            switch (true) {
                case (e instanceof NotFoundError):
                    return res.status(404).send({status: "error", error: e.message});
                    break;
                case (e instanceof ServerError):
                    return res.status(500).send({status: "error", error: e.message});
                    break;
            }
        };
    });
})();



export default router;