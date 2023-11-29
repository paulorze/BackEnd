import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import __dirname, { addLogger } from './utils.js';
import './dao/dbConfig.js';
import errorHandler from './middlewares/errors/error.middleware.js'
import CartsRouter from './routes/carts.router.js';
import ProductsRouter from './routes/products.router.js';
import UsersRouter from './routes/users.router.js';
import initializePassport from './config/passport.config.js';
import MessagesRouter from './routes/messages.router.js';
import TicketsRouter from './routes/tickets.router.js';

const cartsRouter = new CartsRouter();
const messagesRouter = new MessagesRouter();
const productsRouter = new ProductsRouter();
const sessionsRouter = new UsersRouter();
const ticketsRouter = new TicketsRouter();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(cors());
app.use(errorHandler);
app.use(addLogger);

app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/messages', messagesRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/users', sessionsRouter.getRouter());
app.use('/api/tickets', ticketsRouter.getRouter());
app.get('/loggerTest', (req, res) => {
    req.logger.fatal('Testing the logger for: fatal');
    req.logger.error('Testing the logger for: error');
    req.logger.warning('Testing the logger for: warn');
    req.logger.info('Testing the logger for: info');
    req.logger.http('Testing the logger for: http');
    req.logger.debug('Testing the logger for: debug');
});

app.listen(8080, ()=> console.log('Server Running'));