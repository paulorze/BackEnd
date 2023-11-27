import { adminKey } from "./config.js";

const validCategories = [
    'Bazaar', 
    'Herramientas', 
    'Electrodomésticos', 
    'Pequeños Electrodomésticos'
]

const validKeys = [
    'title', 
    'category', 
    'description', 
    'price', 
    'thumbnail', 
    'code', 
    'stock'
];

const passportStrategiesEnum = {
    JWT: 'jwt',
    NOTHING: 'na'
};

const accessRolesEnum = {
    ADMIN: adminKey,
    USER: "USER",
    PUBLIC: "PUBLIC"
};

export {
    validCategories,
    validKeys,
    passportStrategiesEnum,
    accessRolesEnum
}