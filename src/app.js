import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import path from 'path';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import messagesRouter from './routes/messages.router.js';
import productsRouter from './routes/products.router.js';

const app = express();
const __handlebardirname = __dirname+"/public";// Estas tres lineas son para poder usar el css de manera dinamica
app.use('/', express.static(path.join(__dirname, '..', 'public')));//
app.use(express.static(__handlebardirname)); //

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/products', productsRouter);

try {
    await mongoose.connect('mongodb+srv://rzeszutagustin:RUyDKYTT4eNIArQc@cluster-47300ap.rynvm5t.mongodb.net/')
    console.log('Database Connected');
} catch (e) {
    console.log(e.message);
};

app.listen(8080, ()=> console.log('Server Running'));