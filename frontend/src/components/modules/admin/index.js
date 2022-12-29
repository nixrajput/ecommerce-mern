import { lazy } from "react";
import { TraverseRoutes, ProtectedRoute } from "../../route";

const Dashboard = lazy(() => import("./dashboard"));
const ProductList = lazy(() => import("./product-list"));
const NewProduct = lazy(() => import("./new-product"));
const UserList = lazy(() => import("./user-list"));
const OrderList = lazy(() => import("./order-list"));
const EditUser = lazy(() => import("./update-user"));
const EditProduct = lazy(() => import("./update-product"));
const ReviewList = lazy(() => import("./review-list"));
const EditOrder = lazy(() => import("./process-order"));

const routes = [
  {
    path: "dashboard",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <Dashboard />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "products",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <ProductList />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "product/new",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <NewProduct />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "products/:id",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <EditProduct />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "users",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <UserList />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "users/:id",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <EditUser />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "orders",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <OrderList />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "orders/:id",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <EditOrder />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "reviews",
    element: (
      <ProtectedRoute isAdmin={true}>
        {" "}
        <ReviewList />{" "}
      </ProtectedRoute>
    ),
  },
];

const AdminModule = () => <TraverseRoutes routes={routes} />;

export default AdminModule;
