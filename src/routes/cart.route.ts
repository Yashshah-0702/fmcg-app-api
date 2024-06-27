import { Router } from "express";
import { Routes } from "@/interfaces/routes.interface";
import CartController from "@/controllers/cart.controller";
import authMiddleware from "@/middlewares/auth.middleware";

class CartRoutes implements Routes {
    public path = "/cart";
    public router = Router();
    public cartController = new CartController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware, this.cartController.getCart);
        this.router.get(`${this.path}/:id`, authMiddleware, this.cartController.getOneCart);
        this.router.post(`${this.path}`, authMiddleware, this.cartController.createCart);
        this.router.put(`${this.path}/:id`, authMiddleware, this.cartController.placeOrder);
        this.router.delete(`${this.path}`, authMiddleware, this.cartController.removeProductFromCart);
    }
}

export default CartRoutes;