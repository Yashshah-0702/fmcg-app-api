export interface Cart {
    products: {
        product: string; // or ObjectId if you are using Types.ObjectId
        quantity: number;
    }[];
    user_id: string; // or ObjectId if you are using Types.ObjectId
    total_quantity: number;
    total_price: number;
    status: number;
}
