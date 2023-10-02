import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                pid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
});

cartSchema.pre('find', function(){
this.populate('products.pid');
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);