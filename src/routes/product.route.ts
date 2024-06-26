import { Router } from "express";
import { Routes } from '@interfaces/routes.interface';
import ProductsController from "@/controllers/product.controller";
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { uploadImgMiddleware } from "@/utils/fileUpload.utils";
import { CreateProductDto } from "@/dtos/products.dto";

class ProductRoutes implements Routes{
    public path ="/products";
    public router = Router();
    public productsController = new ProductsController();
    
    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.get(`${this.path}`)
        this.router.post(`${this.path}`,authMiddleware,uploadImgMiddleware,validationMiddleware(CreateProductDto,'body'),this.productsController.createProduct)
    }
}
export default ProductRoutes;