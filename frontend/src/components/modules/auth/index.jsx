import { lazy } from "react";
import { TraverseRoutes, ProtectedRoute } from "../../route";

const Login = lazy(() => import("./login"));
const Register = lazy(() => import("./register"));
const ForgotPassword = lazy(() => import("./forgot-password"));
const ResetPassword = lazy(() => import("./reset-password"));
const UpdatePassword = lazy(() => import("./update-password"));

const routes = [
  {
    path: "login",
    element: <Login />,
  },

  {
    path: "register",
    element: <Register />,
  },

  {
    path: "password/forgot",
    element: <ForgotPassword />,
  },

  {
    path: "password/reset/:token",
    element: <ResetPassword />,
  },

  {
    path: "password/update",
    element: (
      <ProtectedRoute>
        <UpdatePassword />
      </ProtectedRoute>
    ),
  },
];

const AuthModule = () => <TraverseRoutes routes={routes} />;

export default AuthModule;
