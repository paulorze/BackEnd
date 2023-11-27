import cookieParser from 'cookie-parser';
import express from 'express';
import passport from 'passport';
import __dirname from './utils.js';
import './dao/dbConfig.js';
// import cors from 'cors';
import CartsRouter from './routes/carts.router.js';
import ProductsRouter from './routes/products.router.js';
import UsersRouter from './routes/users.router.js';
import initializePassport from './config/passport.config.js';

const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();
const sessionsRouter = new UsersRouter();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
// app.use(cors());

app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/users', sessionsRouter.getRouter());

app.listen(8080, ()=> console.log('Server Running'));