import { CreateProductDto } from "@/dtos/products.dto";
import { Product } from "@/interfaces/products.interface";
import productModel from "@/models/product.model";

class ProductService{
    public products = productModel;

    public async createProduct(productData: CreateProductDto): Promise<Product>{
        const createProductData: Product = await this.products.create({...productData});
        return createProductData;
    }
}

export default ProductService;