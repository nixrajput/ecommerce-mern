import { lazy } from "react";
import { TraverseRoutes } from "../../route";

const ProductDetails = lazy(() => import("./product-details"));
const ProductList = lazy(() => import("./product-list"));

const routes = [
  {
    path: "",
    element: <ProductList />,
  },

  {
    path: "search/:keyword",
    element: <ProductList />,
  },

  {
    path: ":id",
    element: <ProductDetails />,
  },
];

const ProductModule = () => <TraverseRoutes routes={routes} />;

export default ProductModule;
