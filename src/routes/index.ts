import AuthRoute from "./auth.route";
import UsersRoute from "./users.route";
import ProductRoutes from "./product.route";
import CartRoutes from "./cart.route";

const Routes = [new AuthRoute(),new UsersRoute(),new ProductRoutes(),new CartRoutes()]

export default Routes