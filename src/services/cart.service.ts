import cartModel from "@/models/cart.model";

class CartService{
    public carts = cartModel;

    public async getCart(type:number , page: number , limit: number , sortField: string , sortOrder: string ){
        const skip = (page - 1) * limit;
        const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        
        return this.carts.find({ status: type })
                         .sort(sort)
                         .skip(skip)
                         .limit(limit);
    }

    public async getOneCart(input:Object){
        return this.carts.findOne(input);
    }

    public async updateCart(cartId:string,userId:string,status:number){
        return this.carts.findOneAndUpdate ({_id:cartId , user_id:userId},{status},{new:true});
    }
}

export default CartService;