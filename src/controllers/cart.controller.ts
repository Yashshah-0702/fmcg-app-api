import { AddCart } from "@/dtos/cart.dto";
import { Cart } from "@/interfaces/cart.interface";
import CartService from "@/services/cart.service";
import cartModel from "@/models/cart.model";
import ProductService from "@/services/product.service";
import { success, failure } from "@/utils/response.utils";
import { httpStatusCodes } from "@/constants/httpStatusCodes.constants";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { Response } from "express";
import { sendEmail } from "@/utils/sendEmail.utils";

class CartController{
    public cartService = new CartService();
    public productService = new ProductService();
    public cart = cartModel;

    public getCart = async(req:RequestWithUser,res:Response) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const sortField = req.query.sortField as string || 'createdAt';
            const sortOrder = req.query.sortOrder as string || 'asc';
            const userId = req.user;
            if(userId.user_type!==1){
                return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied")
            }
            const carts:Cart[] = await this.cartService.getCart(1,page,limit,sortField,sortOrder);
            return success(res,httpStatusCodes.SUCCESS,"Orders fetched successfully",carts)
        } catch (error) {
            return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
        }
    }

    public getOneCart = async(req:RequestWithUser,res:Response) => {
        try {
            const user = req.user
            const userId = user._id;
            const cartId = req.params.id;
            let cart:Cart = await this.cartService.getOneCart({_id:cartId,user_id:userId,status:0});
            if(user.user_type===1){
              cart = await this.cartService.getOneCart({_id:cartId,status:0});
            }
            if(!cart){
                return failure(res,httpStatusCodes.NOT_FOUND,"Cart not found")
            }
            return success(res,httpStatusCodes.SUCCESS,"Cart fetched successfully",cart)
        } catch (error) {
            return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
        }
    }   

    public createCart = async (req: RequestWithUser, res: Response) => {
        try {
            const userData = req.user;
            const cartData: AddCart = req.body;
            const product = await this.productService.findOneProduct({_id:cartData.productId});
            if(!product){
                return failure(res,httpStatusCodes.NOT_FOUND,"Product not found")
            }
            let cart = await this.cart.findOne({user_id:userData._id,status:0});
            if (!cart) {
                cart = new this.cart({
                    user_id: userData._id,
                    products: [],
                    total_quantity: 0,
                    total_price: 0
                });
            }

            // Check if the product already exists in the cart
            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === cartData.productId);

            if (existingProductIndex !== -1) {
                // If the product already exists in the cart, update the quantity
                cart.products[existingProductIndex].quantity += parseInt(cartData.quantity);
            } else {
                // If the product is not in the cart, add it
                cart.products.push({ product: product._id, quantity: parseInt(cartData.quantity) });
            }

            const productPrice = product.price; // Adjust as per your actual schema
            cart.total_quantity += parseInt(cartData.quantity);
            cart.total_price += parseInt(cartData.quantity) * productPrice;

            // Save the updated cart
            await cart.save();

            return success(res, httpStatusCodes.CREATED, "Product added to cart successfully", cart);
        } catch (error) {
            console.error(error);
            return failure(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Server error");
        }
    }

    public removeProductFromCart = async (req: RequestWithUser, res: Response) => {
        try {
            const cartData:AddCart = req.body;
            const quantity = parseInt(cartData.quantity);
            const userId = req.user._id; 

            const product = await this.productService.findOneProduct({ _id: cartData.productId });
            const cart = await this.cart.findOne({ user_id: userId, status: 0 });

            if (!cart) {
                return failure(res, httpStatusCodes.NOT_FOUND, "Cart not found");
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === cartData.productId);

            if (productIndex === -1) {
                return failure(res, httpStatusCodes.NOT_FOUND, "Product not found in cart");
            }
            if (quantity !== undefined && quantity > 0) {
                const currentQuantity = cart.products[productIndex].quantity;
                if (quantity >= currentQuantity) {
                    cart.products.splice(productIndex, 1);
                } else {
                    cart.products[productIndex].quantity -= quantity;
                    cart.total_quantity -= quantity;
                    cart.total_price -= quantity * product.price;
                }
            } else {
                cart.products.splice(productIndex, 1);
            }
            await cart.save();

            return success(res, httpStatusCodes.SUCCESS, "Product removed from cart successfully", cart);
        } catch (error) {
            console.error(error);
            return failure(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Server error");
        }
    }

    public placeOrder = async (req: RequestWithUser, res: Response) => {
        try {
            const user = req.user;
            const cartId = req.params.id
            const status = 1;
            const cartData = await this.cart.findOne({_id:cartId,user_id:user._id,status:0});
            if(!cartData){
                return failure(res,httpStatusCodes.NOT_FOUND,"Cart not found")
            }
            const cart = await this.cartService.updateCart(cartId,user._id,status);
            const subject = "Congratulation , Order Placed";
            const html = `<h1>Your order has been placed successfully</h1> 
            <p>Order ID: ${cart._id}</p>
            <p>itmes: ${cart.products.length}</p>
            <p>Total Quantity: ${cart.total_quantity}</p>
            <p>Total Price: ${cart.total_price}</p>
            <p>Thank you for shopping with us</p>`;

            sendEmail(user.email,subject,html);
            return success(res, httpStatusCodes.SUCCESS, "Order placed successfully", cart);
        } catch (error) {
            return failure(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Server error");
        }
    }
}

export default CartController;