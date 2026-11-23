import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import WebFont from "webfontloader";
import { loadUser } from "./redux/actions/userAction";
import { TraverseRoutes } from "./components/route";
import Loader from "./components/layout/loader/Loader";

import NotFound from "./components/layout/error/NotFound";
const AuthModule = lazy(() => import("./components/modules/auth"));
const HomeModule = lazy(() => import("./components/modules/home"));
const UserModule = lazy(() => import("./components/modules/user"));
const AdminModule = lazy(() => import("./components/modules/admin"));
const ProductModule = lazy(() => import("./components/modules/product"));
const CartModule = lazy(() => import("./components/modules/cart"));
const CheckoutModule = lazy(() => import("./components/modules/checkout"));
const OrderModule = lazy(() => import("./components/modules/order"));
const About = lazy(() => import("./components/modules/about"));
const Contact = lazy(() => import("./components/modules/contact"));

const routes = [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },

  {
    path: "auth/*",
    element: <AuthModule />,
  },

  {
    path: "home/*",
    element: <HomeModule />,
  },

  {
    path: "user/*",
    element: <UserModule />,
  },

  {
    path: "admin/*",
    element: <AdminModule />,
  },

  {
    path: "products/*",
    element: <ProductModule />,
  },

  {
    path: "cart/*",
    element: <CartModule />,
  },

  {
    path: "checkout/*",
    element: <CheckoutModule />,
  },

  {
    path: "orders/*",
    element: <OrderModule />,
  },

  {
    path: "about",
    element: <About />,
  },

  {
    path: "contact",
    element: <Contact />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Jost", "Roboto", "Droid Sans"],
      },
    });

    const token = localStorage.getItem("token");

    if (token) {
      dispatch(loadUser(token));
    }

    return () => {};
  }, [dispatch]);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Suspense fallback={<Loader fullScreen />}>
        <TraverseRoutes routes={routes} />
      </Suspense>
    </Router>
  );
}

export default App;
