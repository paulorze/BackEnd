import { Router } from "express";
import { uploader } from "../utils.js";
import { ProductManager } from "../ProductManager.js";
import { NotFoundError, ServerError, ValidationError } from "../ErrorManager.js";

const router = Router();

(async()=> {
    const productManager = new ProductManager({path: './products.json'});
    await productManager.init();

    router.get('/', (req, res)=> {
        try {            
            res.render('index', {
                    title: "Productos",
                    style: "index.css",
                    products: productManager.getProducts()
                });
        } catch (error) {
            return res.status(412).send({status: "error", error: error.message});
        }    
    });

    router.get('/realTimeProducts', (req, res)=> {
        try {            
            res.render('realTimeProducts', {
                    title: "Real Time Products",
                    style: "realTimeProducts.css",
                    products: productManager.getProducts()
                });
        } catch (error) {
            return res.status(412).send({status: "error", error: error.message});
        }    
    });

    router.post('/realTimeProducts', uploader.single('thumbnail'), async (req, res)=> {
        if (!req.file) {
            return res.status(428).send({status: 'error', error: 'Por favor, elija una imagen de formato valido.'})
        }
        const product = req.body;
        if (!product.title || !product.category || !product.description || !product.price || !product.code || !product.stock) {
            return res.status(428).send({status: "error", error: "Por favor, ingrese todos los datos necesarios del producto (titulo, descripcion, precio, miniatura, codigo, stock)."});
        };
        try {
            await productManager.addProduct({title: product.title, category: product.category, description: product.description, price:product.price, thumbnail: req.file.path, code: product.code, stock: product.stock});
            res.render('realTimeProducts', {
                title: "Real Time Products",
                style: "realTimeProducts.css",
                products: productManager.getProducts()
            });
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

    router.delete('/realTimeProducts/:pid', async (req, res)=> {
        const pid = req.params.pid;
        try {
            await productManager.deleteProduct(pid);
            res.render('realTimeProducts', {
                title: "Real Time Products",
                style: "realTimeProducts.css",
                products: productManager.getProducts()
            });

        } catch (error) {
            switch (true) {
                case (error instanceof NotFoundError):
                    return res.status(404).send({status: "error", error: error.message});
                    break;
                case (e instanceof ServerError):
                    return res.status(500).send({status: "error", error: error.message});
                    break;
            }
        };
    });
})();



export default router;