import "../Checkout.css";
import React from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import AppWrap from "../../../hoc/AppWrap";

function OrderSuccess() {
  return (
    <div className="app__top-margin">
      <div className="app__flex-container">
        <div className="app__flex-card">
          <div className="order-success-box">
            <div className="message">
              <BsFillPatchCheckFill />

              <p>Your Order has been Placed successfully.</p>
            </div>

            <Link to="/orders">View Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppWrap(OrderSuccess);
