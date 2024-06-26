import { Product } from "./products.interface";
import { User } from "./users.interface";

export interface Cart{
    _id:string;
    products:Product[];
    user_id:string;
    quantity:number;
    total_price:number;
    status:number
}