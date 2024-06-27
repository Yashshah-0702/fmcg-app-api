import { model, Schema, Document } from 'mongoose';
import { Cart } from '@/interfaces/cart.interface';
import { Product } from '@/interfaces/products.interface';

const cartSchema: Schema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total_quantity: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        enum:[0,1],
        default: 0,
        required: true
    }
});

const cartModel = model<Cart & Document>('Cart', cartSchema);
export default cartModel;
