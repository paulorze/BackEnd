import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { ProductManager } from './ProductManager.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __handlebardirname = __dirname+"/public";
app.use('/', express.static(path.join(__dirname, '..', 'public')));

(async()=>{
    const httpServer = app.listen(8080, ()=> {
        console.log('Servidor funcionando correctamente en el puerto 8080.')
    });
    const socketServer = new Server(httpServer);

    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.engine('handlebars', handlebars.engine());
    app.set('views', __dirname+'/views');
    app.set('view engine', 'handlebars');
    app.use(express.static(__handlebardirname));
    app.use('/',viewsRouter);
    
    let newProducts =[];
    const productManager = new ProductManager({path: './products.json'});
    await productManager.init();
    socketServer.on('connection', socket=>{
        console.log("New Socket connection established (?)");
        newProducts = productManager.getProducts();
        socketServer.emit('update-products', newProducts);
        socket.on('new-product', () => {
            newProducts = productManager.getProducts();
            socketServer.emit('update-products', newProducts);
        });
    });
})();