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
        this.router.get(`${this.path}`,this.productsController.getProducts)
        this.router.get(`${this.path}/:id`,this.productsController.getProductById)
        this.router.post(`${this.path}`,authMiddleware,uploadImgMiddleware,validationMiddleware(CreateProductDto,'body'),this.productsController.createProduct)
        this.router.put(`${this.path}/:id`,authMiddleware,uploadImgMiddleware,validationMiddleware(CreateProductDto,'body',true),this.productsController.updateProduct)
        this.router.delete(`${this.path}/:id`,authMiddleware,uploadImgMiddleware,this.productsController.deleteProduct)
    }
}
export default ProductRoutes;