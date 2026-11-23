import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdListAlt,
  MdReviews,
  MdStorefront,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";

function Sidebar({ active }) {
  const navigate = useNavigate();

  return (
    <div className="app__sidebar">
      <div
        className={
          active === "dashboard" ? "sidebar-item selected" : "sidebar-item"
        }
        onClick={() => navigate("/admin/dashboard")}
      >
        <MdDashboard /> <span>Dashboard</span>
      </div>

      <div
        className={
          active === "products" ? "sidebar-item selected" : "sidebar-item"
        }
        onClick={() => navigate("/admin/products")}
      >
        <MdStorefront /> <span>Products</span>
      </div>

      <div
        className={
          active === "orders" ? "sidebar-item selected" : "sidebar-item"
        }
        onClick={() => navigate("/admin/orders")}
      >
        <MdListAlt /> <span>Orders</span>
      </div>

      <div
        className={
          active === "users" ? "sidebar-item selected" : "sidebar-item"
        }
        onClick={() => navigate("/admin/users")}
      >
        <FaUsers /> <span>Users</span>
      </div>

      <div
        className={
          active === "reviews" ? "sidebar-item selected" : "sidebar-item"
        }
        onClick={() => navigate("/admin/reviews")}
      >
        <MdReviews /> <span>Reviews</span>
      </div>
    </div>
  );
}

export default Sidebar;
