import "./Header.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingCart,
  FiSearch,
  FiLogOut,
  FiList,
  FiPieChart,
} from "react-icons/fi";
import { logout } from "../../../redux/actions/userAction";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import Logo from "../../../assets/images/logo.png";
import FavIcon from "../../../assets/images/favicon.png";
import profilePng from "../../../assets/images/profile.jpg";

function Header() {
  const dispatch = useDispatch();

  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);

  const handleMenuClick = (evt) => {
    setAnchorEl(evt.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openMenu = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigateToDashboard = () => {
    navigate("/admin/dashboard");
  };

  const navigateToProfile = () => {
    navigate("/user/profile");
  };

  const navigateToCart = () => {
    navigate("/cart");
  };

  const navigateToOrders = () => {
    navigate("/orders");
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products/search/${searchKeyword}`);
    } else {
      navigate("/products");
    }
  };

  const UserOptions = [
    {
      icon: <FiUser />,
      name: "Profile",
      func: navigateToProfile,
    },
    {
      icon: <FiShoppingCart />,
      name: "My Cart",
      func: navigateToCart,
    },
    {
      icon: <FiList />,
      name: "My Orders",
      func: navigateToOrders,
    },
    {
      icon: <FiLogOut />,
      name: "Logout",
      func: handleLogout,
    },
  ];

  if (isAuthenticated && !loading && user.role === "admin") {
    UserOptions.unshift({
      icon: <FiPieChart />,
      name: "Dashboard",
      func: navigateToDashboard,
    });
  }

  return (
    <div className="header" id="header">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          className="logo"
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            className="logo-img logo-main"
            width="100%"
            height="100%"
            src={Logo}
            alt="logo"
            loading="lazy"
          />

          <img
            className="logo-img favicon"
            width="100%"
            height="100%"
            src={FavIcon}
            alt="logo"
            loading="lazy"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {showSearchBox ? (
          <div className="search-input">
            <input
              type="text"
              placeholder="Search for product"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />

            <button onClick={searchSubmitHandler}>
              <FiSearch />
            </button>
          </div>
        ) : (
          <div
            className="header-icon"
            onClick={() => {
              setShowSearchBox(true);
            }}
          >
            <FiSearch />
          </div>
        )}

        <div
          className="header-icon"
          onClick={() => {
            navigate("/cart");
          }}
        >
          <Badge badgeContent={cartItems.length} color="primary">
            <FiShoppingCart />
          </Badge>
        </div>

        {isAuthenticated ? (
          <div>
            <div
              className="header-icon"
              id="user-button"
              aria-controls={openMenu ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={(evt) => {
                handleMenuClick(evt);
              }}
            >
              <img
                className="header-user-img"
                src={user.avatar ? user.avatar.url : profilePng}
                alt="user"
              />
            </div>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "user-button",
              }}
            >
              {UserOptions.map((option, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleCloseMenu();
                    option.func();
                  }}
                  style={{
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      marginRight: 10,
                      color: "grey",
                    }}
                  >
                    {option.icon}
                  </span>
                  {option.name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ) : (
          <div
            className="header-icon"
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            <FiUser />
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
