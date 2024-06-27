import cartModel from "@/models/cart.model";

class CartService{
    public carts = cartModel;

    public async getCart(type:number){
        return this.carts.find({status:type});
    }

    public async getOneCart(input:Object){
        return this.carts.findOne(input);
    }

    public async updateCart(cartId:string,userId:string,status:number){
        return this.carts.findOneAndUpdate ({_id:cartId , user_id:userId},{status},{new:true});
    }
}

export default CartService;