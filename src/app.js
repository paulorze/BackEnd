import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import path from 'path';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import CartsRouter from './routes/carts.router.js';
import MessagesRouter from './routes/messages.router.js';
import ProductsRouter from './routes/products.router.js';
import SessionsRouter from './routes/sessions.router.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

const cartsRouter = new CartsRouter();
const messagesRouter = new MessagesRouter();
const productsRouter = new ProductsRouter();
const sessionsRouter = new SessionsRouter();

const app = express();

initializePassport();
app.use(passport.initialize());

const __handlebardirname = __dirname+"/public";// Estas tres lineas son para poder usar el css de manera dinamica
app.use('/', express.static(path.join(__dirname, '..', 'public')));//
app.use(express.static(__handlebardirname)); //

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/messages', messagesRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/sessions', sessionsRouter.getRouter());

try {
    await mongoose.connect('mongodb+srv://rzeszutagustin:RUyDKYTT4eNIArQc@cluster-47300ap.rynvm5t.mongodb.net/')
    console.log('Database Connected');
} catch (e) {
    console.log(e.message);
};

app.listen(8080, ()=> console.log('Server Running'));