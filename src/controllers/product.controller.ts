import { Product } from "@/interfaces/products.interface";
import ProductService from "@/services/product.service";
import { success,failure } from "@/utils/response.utils";
import { httpStatusCodes } from "@/constants/httpStatusCodes.constants";
import { CreateProductDto } from "@/dtos/products.dto";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { Response } from "express";
import { User } from "@/interfaces/users.interface";

class ProductsController{
    public productService = new ProductService();

    public createProduct = async(req:RequestWithUser,res:Response) => {
     try {
        const userData:User = req.user;
        const productImagePath = req.media_details.file_path + req.media_details.name
        if(userData.user_type!==1){
            return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied",{})
        }
        const productData:CreateProductDto = req.body;
        const data = {
            ...productData,
            image:productImagePath
        }
        const createProductData:Product = await this.productService.createProduct(data);
        return success(res,httpStatusCodes.CREATED,"Product created successfully",createProductData)
        // console.log(createProductData)
     } catch (error) {
        return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error",{})
     }
    }
}

export default ProductsController