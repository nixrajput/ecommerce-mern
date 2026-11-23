import { lazy } from "react";
import { TraverseRoutes } from "../../route";

const Cart = lazy(() => import("./my-cart"));

const routes = [
  {
    path: "",
    element: <Cart />,
  },
];

const CartModule = () => <TraverseRoutes routes={routes} />;

export default CartModule;
