import "../Dashboard.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import { FaShippingFast } from "react-icons/fa";
import { UPDATE_ORDER_RESET } from "../../../../redux/constants/orderConstants";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../../../redux/actions/orderAction";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import Loader from "../../../layout/loader/Loader";
import AppWrap from "../../../hoc/AppWrap";

function ProcessOrder() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { id } = useParams();

  const { token } = useSelector((state) => state.user);
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(updateOrder(id, myForm, token));
  };

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Status Updated Successfully.");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(id, token));

    return () => {};
  }, [dispatch, alert, error, id, isUpdated, updateError, token]);

  return (
    <div className="app__top-margin">
      <MetaData title="Update Order - Admin Panel" />

      <div className="app__dashboard">
        <SideBar active="orders" />

        {loading ? (
          <div
            style={{
              marginTop: "4rem",
            }}
          >
            <Loader />
          </div>
        ) : (
          <div className="app__dashboard-container">
            <div className="title">Update Order</div>

            <div className="app__order-container">
              <div className="shipping-info-box">
                <div className="box-header">
                  <p>Shipping Info</p>
                </div>

                <div className="order-details">
                  <div className="info-tile">
                    <p>Name</p>
                    <span>{order.user && order.user.name}</span>
                  </div>

                  <div className="info-tile">
                    <p>Phone</p>
                    <span>
                      {order.shippingInfo && order.shippingInfo.phoneNo}
                    </span>
                  </div>

                  <div className="info-tile">
                    <p>Address</p>
                    <span>
                      {order.shippingInfo &&
                        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                    </span>
                  </div>
                </div>

                <div className="box-header">
                  <p>Payment Info</p>
                </div>

                <div className="order-details">
                  <div className="info-tile">
                    <p>Payment Status</p>

                    <span
                      className={
                        order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </span>
                  </div>

                  <div className="info-tile">
                    <p>Amount</p>
                    <span>{order.totalPrice && order.totalPrice}</span>
                  </div>

                  <div className="info-tile">
                    <p>Order Status</p>
                    <span
                      className={
                        order.orderStatus && order.orderStatus === "Delivered"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order.orderStatus && order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="box-header">
                  <p>Order Items</p>
                </div>

                <div className="item-list">
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item.product} className="item-card">
                        <img src={item.image} alt="Product" />

                        <div className="details">
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                          <span>
                            {item.quantity} X ₹{item.price} ={" "}
                            <b>₹{item.price * item.quantity}</b>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {(order.orderStatus === "Processing" ||
                  order.orderStatus === "Shipped") && (
                  <div className="box-header">
                    <p>Process Order</p>
                  </div>
                )}

                {(order.orderStatus === "Processing" ||
                  order.orderStatus === "Shipped") && (
                  <form
                    onSubmit={updateOrderSubmitHandler}
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <div className="form-control">
                      <FaShippingFast />
                      <select onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select</option>
                        {order.orderStatus === "Processing" && (
                          <option value="Shipped">Shipped</option>
                        )}

                        {order.orderStatus === "Shipped" && (
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    <button
                      className="rounded-filled-btn"
                      style={{
                        marginTop: "1rem",
                      }}
                      type="submit"
                      disabled={
                        loading ? true : false || status === "" ? true : false
                      }
                    >
                      Process
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppWrap(ProcessOrder);
