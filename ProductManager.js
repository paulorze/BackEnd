class ProductManager {
    #products;
    constructor (){
        this.#products = [];
    };

    addProduct ({title, description, price, thumbnail, code, stock}) {
        const existingCode = this.#products.find(product => product.code === code);
        if (existingCode) {
            console.log('El codigo ingresado ya fue utilizado en otro producto.');
            return;
        };
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Por favor, ingrese todos los datos necesarios del producto (titulo, descripcion, precio, miniatura, codigo, stock).');
            return;
        };
        const product = {
            id : this.#products.length,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.#products.push(product);
        return product;
    };

    getProducts () {
        return this.#products
    };

    getProductByID (productID) {
        const productFound = this.#products.find(product => product.id === productID);
        if (!productFound) {
            console.log(`NOT FOUND: El producto con ID ${productID} no existe.`);
            return;
        } else {
            console.log(`El producto encontrado con el ID ${productID} es "${productFound.title}", de codigo "${productFound.code}". Su descripcion es "${productFound.description}" y su miniatura, ${productFound.thumbnail}. Tiene un costo de $${productFound.price} y un stock de ${productFound.stock} unidad(es).`);
            return productFound;
        }
    };
};

const productManager = new ProductManager();
const product1 = productManager.addProduct({
    title : 'Producto 1',
    description : 'Producto nuevo y muy piola',
    price : 200,
    thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
    code: 'P001',
    stock: 20
});
const product2 = productManager.addProduct({
    title : 'Producto 2',
    description : 'Producto nuevo y muy piola',
    price : 200,
    thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
    code: 'P002',
    stock: 20
});
const product3 = productManager.addProduct({
    title : 'Producto 3',
    description : 'Producto nuevo y muy piola',
    price : 200,
    thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
    code: 'P003',
    stock: 20
});
const product4 = productManager.addProduct({
    title : 'Producto 4',
    description : 'Producto nuevo y muy piola',
    price : 200,
    thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
    code: 'P004',
    stock: 20
});
const product5 = productManager.addProduct({
    title : 'Producto 5',
    description : 'Producto nuevo y muy piola',
    price : 200,
    thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
    code: 'P001',
    stock: 20
});
const product6 = productManager.addProduct({
    title : 'Producto 6',
    description : 'Producto nuevo y muy piola',
    thumbnail: 'https://w7.pngwing.com/pngs/405/993/png-transparent-pikachu-haunter-drawing-pokxe9mon-art-tongue-purple-monster-purple-mammal-cat-like-mammal.png',
    code: 'P006'
});
const allProducts = productManager.getProducts();
console.log('Todos los productos son: ', allProducts);
const busqueda1 = productManager.getProductByID(1);
const busqueda2 = productManager.getProductByID(10);
