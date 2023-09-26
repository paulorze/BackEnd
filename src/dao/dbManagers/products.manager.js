import { productsModel } from "../models/products.model.js";
import { ServerError, NotFoundError, ValidationError } from "./errors.manager.js";
import { validCategories, validKeys } from "./validCategories.manager.js";

export default class Products {
    constructor() {
        console.log('Products');
    };

    getAll = async() => {
        try {
            const products = await productsModel.find().lean();
            return products;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    getAllLimit = async(limit)=>{
        if (isNaN(limit) || limit <= 0){
            throw new TypeError('Por favor, ingrese una cantidad de productos a mostrar valida.');
        };
        try {            
            const products = await productsModel.find().sort({_id: -1}).limit(limit).lean();
            return products;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar los productos.');
        };
    };

    getByID = async(id)=> {
        try {
            const product = await productsModel.find({_id: id}).lean();
            if (!productFound) {
                throw new NotFoundError(`404 NOT FOUND: El producto con ID ${id} no existe.`)
            };
            return product;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al cargar el producto.');
        };
    };

    addProduct = async (product)=> {
        this.validateTitle(product.title);
        this.validateCategory(product.category);
        this.validateDescription(product.description);
        this.validateNumber(product.price, 'price');
        this.validateCode(product.code);
        this.validateNumber(product.stock, 'stock');
        try {
            const result = await productsModel.create(product);
            return result;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al guardar el producto.');
        };
    };
    
    updateProduct = async (id, data)=> {
        const foundProduct = this.getByID(id)
        for (const [key, value] of Object.entries(data)) {
            if (!validKeys.includes(key)) throw new TypeError ('Por favor, ingrese solamente parametros validos (title, category, description, price, thumbnail, code, stock).');
        };
        for (const [key, value] of Object.entries(data)) {
            switch (key) {
                case 'title':
                    this.validateTitle(value);
                    foundProduct[key] = value;
                    break;
                case 'category':
                    this.validateCategory(value);
                    foundProduct[key] = value;
                    break;
                case 'description':
                    this.validateDescription(value);
                    foundProduct[key] = value;
                    break;
                case 'price':
                    this.validateNumber(value, 'price');
                    foundProduct[key] = value;
                    break;
                case 'code':
                    this.validateCode(value);
                    foundProduct[key] = value;
                    break;
                case 'stock':
                    this.validateNumber(value, 'stock');
                    foundProduct[key] = value;
                    break;
            };
        };
        try {
            const result = await productsModel.updateOne({_id: id}, foundProduct);
            return result;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al actualizar el producto (asegurese que no existe el Codigo del Producto en la base de datos).');
        };
    };

    deleteProduct = async (id) => {
        try {            
            const result = await productsModel.deleteOne({_id: id});
            return result;
        } catch {
            throw new ServerError ('500 INTERNAL SERVER ERROR: Error al guardar el producto.');
        };
    };

    validateTitle (string) {
        const titleRegEx= /^(?=.*[A-Za-z0-9'"()/áéíóúÁÉÍÓÚ])[\w\d\s'"()/áéíóúÁÉÍÓÚ]{5,40}$/;
        if (!titleRegEx.test(string.trim())) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: El título ingresado no es válido.`);
        };
    }

    validateCategory (category) {
        if (!validCategories.includes(category)) {
            throw new ValidationError ('412 PRECONDITION FAILED ERROR: La categoría ingresada no es válida.');
        };
    };

    validateDescription (description) {
        const descriptionRegEx = /^(?=[\s\S]*[A-Za-z0-9'"()/.,;¡!¿?:\n\ráéíóúÁÉÍÓÚ])[\w\d\s'"()/.,;¡!¿?:\n\ráéíóúÁÉÍÓÚ]{50,400}$/;
        if (!descriptionRegEx.test(description.trim())) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: La descripción no cumple con los requisitos.(De 50 a 400 caracteres, solamente puede incluir letras, números, espacios, saltos de línea y los siguientes caracteres: ' " () / : `);
        };
    };

    validateNumber (num, param) {
        if (Number.isNaN(+num) || +num <= 0) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: El valor ingresado como ${param} no es un número válido. (Debe ser un número mayor a 0)`);
        };
    };

    validateCode = async (code) => {
        const regEx = /^[A-Z]\d{3}$/;
        if (!regEx.test(code)) {
            throw new ValidationError ('412 PRECONDITION FAILED ERROR: El código ingresado no tiene formato válido. (Debe ser una letra mayúscula seguida de tres números)')
        };
    };
};