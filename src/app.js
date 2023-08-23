import { ProductManager } from "./ProductManager.js";
import express from 'express';
const app = express();

let productManager;
(async()=>{
    productManager = new ProductManager({path: './products.json'});
    await productManager.init();
})();
app.use(express.urlencoded({extended:true}));

app.get('/products', (req, res)=> {
    const {limit} = req.query;
    if (!limit ) return res.send(productManager.getProducts());
    return res.send(productManager.getProductsLimit(limit));
});

app.get('/products/:pid', (req, res)=> {
    const pid = req.params.pid;
    const productFound = productManager.getProductByID(+pid);
    return res.send(productFound);
});

app.listen(8080, ()=> {
    console.log('Servidor funcionando correctamente en el puerto 8080.')
});

