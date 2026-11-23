import { useSelector } from "react-redux";
import { useLocation, Navigate, Route, Routes } from "react-router-dom";
import Loader from "../layout/loader/Loader";

export const ProtectedRoute = ({ children, isAdmin }) => {
  const location = useLocation();

  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading === false) {
    if (isAuthenticated === false) {
      return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    if (isAuthenticated === true && isAdmin === true && user.role !== "admin") {
      return <Navigate to="/auth/login" replace />;
    }

    return children;
  }

  return <Loader fullScreen={true} />;
};

export const TraverseRoutes = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route) => {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
            {...route}
          />
        );
      })}
    </Routes>
  );
};
