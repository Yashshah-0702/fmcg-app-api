import AuthRoute from "./auth.route";
import UsersRoute from "./users.route";
import ProductRoutes from "./product.route";

const Routes = [new AuthRoute(),new UsersRoute(),new ProductRoutes()]

export default Routes