import dotenv from 'dotenv';

dotenv.config();

const adminKey = process.env.ADMIN_KEY;

const mongoUrl = process.env.MONGO_URL;

const privateKeyJWT = process.env.PRIVATE_KEY_JWT;

export {
    adminKey,
    mongoUrl, 
    privateKeyJWT,
};