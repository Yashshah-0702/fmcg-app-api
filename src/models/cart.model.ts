import { model, Schema, Document } from 'mongoose';
import { Cart } from '@/interfaces/cart.interface';

const cartSchema:Schema = new Schema({
    products:[{
        type:Schema.Types.ObjectId,
        ref:'Product'
    }],
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    quantity:{
        type:Number,
        required:true
    },
    total_price:{
        type:Number,
        required:true
    },
    status:{
        type:Number,
        required:true
    }
})

const cartModel = model<Cart & Document>('Cart',cartSchema)
export default cartModel;