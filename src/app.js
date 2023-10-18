import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import path from 'path';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import messagesRouter from './routes/messages.router.js';
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

const app = express();

try {
    await mongoose.connect('mongodb+srv://rzeszutagustin:RUyDKYTT4eNIArQc@cluster-47300ap.rynvm5t.mongodb.net/')
    console.log('Database Connected');
} catch (e) {
    console.log(e.message);
};

const __handlebardirname = __dirname+"/public";// Estas tres lineas son para poder usar el css de manera dinamica
app.use('/', express.static(path.join(__dirname, '..', 'public')));//
app.use(express.static(__handlebardirname)); //

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'zAb7uEjh01HvM9JUCr7w',
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);

app.listen(8080, ()=> console.log('Server Running'));