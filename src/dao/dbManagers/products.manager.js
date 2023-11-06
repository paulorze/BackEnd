import { productsModel } from "../models/products.model.js";
import { ServerError, ValidationError } from "./errors.manager.js";
import Parent from "./parentClass.manager.js";
import { validCategories, validKeys } from "./validCategories.manager.js";

export default class Products extends Parent {
    constructor() {
        super(productsModel)
    };

    addProduct = async (product)=> {
        try {
            this.validateTitle(product.title);
            this.validateCategory(product.category);
            this.validateDescription(product.description);
            this.validateNumber(product.price, 'price');
            this.validateCode(product.code);
            this.validateNumber(product.stock, 'stock');
            const result = await this.save(product);
            return result;
        } catch (e) {
            if (e instanceof ValidationError){
                throw new ValidationError (e.message);
            } else{
                throw new ServerError ('500 INTERNAL SERVER ERROR: Error al guardar el producto.');
            };
        };
    };
    
    updateProduct = async (id, data)=> {
        const foundProduct = this.getByID(id)
        for (const [key, value] of Object.entries(data)) {
            if (!validKeys.includes(key)) throw new TypeError ('Por favor, ingrese solamente parametros validos (title, category, description, price, thumbnail, code, stock).');
        };
        try {
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
            const result = await this.model.updateOne({_id: id}, foundProduct);
            return result;
        } catch (e) {
            if (e instanceof ValidationError){
                throw new ValidationError (e.message);
            } else{
                throw new ServerError ('500 INTERNAL SERVER ERROR: Error al guardar el producto.');
            };        
        };
    };

    validateTitle (string) {
        const titleRegEx= /^(?=.*[A-Za-z0-9'"()/áéíóúÁÉÍÓÚ])[\w\d\s'"()/áéíóúÁÉÍÓÚ]{5,40}$/;
        if (!titleRegEx.test(string.trim())) {
            throw new ValidationError (`412 PRECONDITION FAILED ERROR: El título ingresado no es válido.`);
        };
    };

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