import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

cartSchema.plugin(mongoosePaginate);

cartSchema.pre('find', function(){
this.populate('products.pid');
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);