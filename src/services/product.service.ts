import { CreateProductDto } from "@/dtos/products.dto";
import { Product } from "@/interfaces/products.interface";
import productModel from "@/models/product.model";

class ProductService{
    public products = productModel;

    public async findAllProducts(page: number , limit: number , sortField: string , sortOrder: string): Promise<Product[]>{
        const skip = (page - 1) * limit;
        const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        const products: Product[] = await this.products.find().sort(sort)
        .skip(skip)
        .limit(limit);
        return products;
    
    }

    public async findOneProduct(input:object): Promise<Product>{
        const product: Product = await this.products.findOne(input);
        return product;
    }

    public async createProduct(productData: CreateProductDto): Promise<Product>{
        const createProductData: Product = await this.products.create({...productData});
        return createProductData;
    }

    public async updateProduct(productId:string,productData: CreateProductDto): Promise<Product>{
        const updateProductById: Product = await this.products.findOneAndUpdate({_id:productId},{$set:productData},{new:true});
        return updateProductById;
    }

    public async deleteProduct(productId:string): Promise<Product>{
        const deleteProductById: Product = await this.products.findOneAndDelete({_id:productId},{new:true});
        return deleteProductById;
    }
}

export default ProductService;