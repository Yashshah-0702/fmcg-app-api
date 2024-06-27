import fs from "fs";
import path from "path";
import { MAIN_UPLOAD_DIR, IMAGE_PATH } from '@/config';
import { Product } from "@/interfaces/products.interface";
import ProductService from "@/services/product.service";
import { success,failure } from "@/utils/response.utils";
import { httpStatusCodes } from "@/constants/httpStatusCodes.constants";
import { CreateProductDto } from "@/dtos/products.dto";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { Request, Response } from "express";
import { User } from "@/interfaces/users.interface";


class ProductsController{
    public productService = new ProductService();
    public dir = path.resolve(__dirname, "../../");

    private removeCertificate = async(product:any)=>{
     const existingProductFileName = product.image.split("/").pop();
     const existingProductFilePath = path.join(this.dir,MAIN_UPLOAD_DIR + "/" + IMAGE_PATH + existingProductFileName);
     await fs.promises.unlink(existingProductFilePath);
    }

    public getProducts = async(req:Request,res:Response) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const sortField = req.query.sortField as string || 'createdAt';
            const sortOrder = req.query.sortOrder as string || 'asc';
            const products:Product[] = await this.productService.findAllProducts(page,limit,sortField,sortOrder);
            return success(res,httpStatusCodes.SUCCESS,"Products fetched successfully",products)
        } catch (error) {
            return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
        }
    }

    public getProductById = async(req:Request,res:Response) => {
        try {
            const product:Product = await this.productService.findOneProduct({_id:req.params.id});
            if(!product){
                return failure(res,httpStatusCodes.NOT_FOUND,"Product not found")
            }
            return success(res,httpStatusCodes.SUCCESS,"Product fetched successfully",product)
        } catch (error) {
            return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
        }
    }

    public createProduct = async(req:RequestWithUser,res:Response) => {
     try {
        const userData:User = req.user;
        const productImagePath = req.media_details.file_path + req.media_details.name
        if(userData.user_type!==1){
            return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied",{})
        }
        if(!req.file){
            return failure(res,httpStatusCodes.BAD_REQUEST,"Please upload an image",{})
        }
        const productData:CreateProductDto = req.body;
        const data = {
            ...productData,
            image:productImagePath
        }
        const createProductData:Product = await this.productService.createProduct(data);
        return success(res,httpStatusCodes.CREATED,"Product created successfully",createProductData)
     } catch (error) {
        return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error",{})
     }
    }

    public updateProduct = async(req:RequestWithUser,res:Response) => {
        try {
            const userData:User = req.user;
            const productData:CreateProductDto = req.body;
            if(userData.user_type!==1){
                return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied",{})
            }
            const product = await this.productService.findOneProduct({_id:req.params.id});
            if(!product){
                return failure(res,httpStatusCodes.NOT_FOUND,"Product not found",{})
            }
            let image = product.image
            if(req.file){
                const productImagePath = req.media_details.file_path + req.media_details.name
                image = productImagePath
                await this.removeCertificate(product)
            }
            const data = {
                ...productData,
                image
            }
            const updateProductData:Product = await this.productService.updateProduct(req.params.id,data);
            return success(res,httpStatusCodes.SUCCESS,"Product updated successfully",updateProductData)
        } catch (error) {
            return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error",{})
        }
    }

    public deleteProduct = async(req:RequestWithUser,res:Response) => {
        try {
            const userData:User = req.user;
            if(userData.user_type!==1){
                return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied",{})
            }
            const product = await this.productService.findOneProduct({_id:req.params.id});
            if(!product){
                return failure(res,httpStatusCodes.NOT_FOUND,"Product not found")
            }
            await this.removeCertificate(product)
            const deleteProductData:Product = await this.productService.deleteProduct(req.params.id);
            return success(res,httpStatusCodes.SUCCESS,"Product deleted successfully",[])
        } catch (error) {
            return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
        }
    }
}

export default ProductsController