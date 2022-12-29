import { lazy } from "react";
import { TraverseRoutes, ProtectedRoute } from "../../route";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const Shipping = lazy(() => import("./shipping"));
const OrderSummary = lazy(() => import("./order-summary"));
const Payment = lazy(() => import("./payment"));
const OrderSuccess = lazy(() => import("./order-success"));

const stripeKey =
  "pk_test_51JCiUfSDU2GWp7bi0VACBFYVB9vcGSEhdg4RQrosWyqZyIvETK6kud3YTIXQ8kjqHEbTRUEvmu3AdWdQ9NSeUtyV00JQVSrn6E";

const stripePromise = loadStripe(stripeKey);

const routes = [
  {
    path: "shipping",
    element: (
      <ProtectedRoute>
        {" "}
        <Shipping />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "summary",
    element: (
      <ProtectedRoute>
        {" "}
        <OrderSummary />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "payment",
    element: (
      <Elements stripe={stripePromise}>
        {" "}
        <ProtectedRoute>
          {" "}
          <Payment />{" "}
        </ProtectedRoute>{" "}
      </Elements>
    ),
  },

  {
    path: "success",
    element: (
      <ProtectedRoute>
        {" "}
        <OrderSuccess />{" "}
      </ProtectedRoute>
    ),
  },
];

const CheckoutModule = () => <TraverseRoutes routes={routes} />;

export default CheckoutModule;
