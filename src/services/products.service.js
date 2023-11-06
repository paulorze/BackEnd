import Products from "../dao/dbManagers/products.manager.js";

const productsManager = new Products();

const getProducts = async (limit = null) => {
    let products;
    if (!limit == null) {
        products = await productsManager.getAllPaginated(limit);
    } else {
        products = await productsManager.getAll();
    };
    return products;
};

const getProductById = async (id) => {
    return await productsManager.getByID(id);
};

const saveProduct = async (product) => {
    return await productsManager.addProduct(product);
};

const deleteProduct = async (id) => {
    return await productsManager.delete(id);
};

const updateProductById = async (id, data) => {
    return await productsManager.updateProduct(id, data);
};

export {
    getProducts,
    getProductById,
    saveProduct,
    deleteProduct,
    updateProductById
};