import { lazy } from "react";
import { TraverseRoutes, ProtectedRoute } from "../../route";

const ProfileDetails = lazy(() => import("./profile-details"));
const UpdateProfile = lazy(() => import("./update-profile"));

const routes = [
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        {" "}
        <ProfileDetails />{" "}
      </ProtectedRoute>
    ),
  },

  {
    path: "profile/update",
    element: (
      <ProtectedRoute>
        {" "}
        <UpdateProfile />{" "}
      </ProtectedRoute>
    ),
  },
];

const UserModule = () => <TraverseRoutes routes={routes} />;

export default UserModule;
