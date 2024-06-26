import { model, Schema, Document } from 'mongoose';
import { Product } from '@/interfaces/products.interface';

const productSchema:Schema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const productModel = model<Product & Document>('Product',productSchema)
export default productModel;