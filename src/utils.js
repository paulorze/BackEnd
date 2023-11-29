// Esto es para poder acceder a los archivos por su ubicacion sin problemas
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Esto es para hashear las passwords
import bcrypt from 'bcrypt';
// Esto es para las sesiones
import jwt from 'jsonwebtoken';
import { privateKeyJWT } from './config/config.js';
// Esto es para el mocking
import {fakerES as faker } from '@faker-js/faker';
import { validCategories } from './config/enums.js';

// Esto es para poder acceder a los archivos por su ubicacion sin problemas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

// Esto es para hashear las passwords
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (plainPassword, hashedPassword) => bcrypt.compareSync(plainPassword, hashedPassword);

// El siguiente codigo corresponde a la permanencia de la sesion del usuario
export const generateToken = (user)=> {
    const token = jwt.sign({user}, privateKeyJWT, {expiresIn: '24h'});
    return token;
};

// El siguiente codigo corresponde al mock de productos

export const mockProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        category: faker.helpers.arrayElement(validCategories),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [faker.image.url(), faker.image.url(), faker.image.url()],
        code: faker.string.alphanumeric(4),
        stock: faker.number.int(1),
    };
};
