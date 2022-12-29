import { lazy } from "react";
import { TraverseRoutes, ProtectedRoute } from "../../route";

const MyOrders = lazy(() => import("./my-orders"));
const OrderDetails = lazy(() => import("./order-details"));

const routes = [
  {
    path: "",
    element: (
      <ProtectedRoute>
        {" "}
        <MyOrders />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: ":id",
    element: (
      <ProtectedRoute>
        {" "}
        <OrderDetails />{" "}
      </ProtectedRoute>
    ),
  },
];

const OrderModule = () => <TraverseRoutes routes={routes} />;

export default OrderModule;
