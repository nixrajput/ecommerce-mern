import "../Order.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import {
  getOrderDetails,
  clearErrors,
} from "../../../../redux/actions/orderAction";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import currency from "../../../helpers/currency";

function OrderDetails() {
  const { token } = useSelector((state) => state.user);
  const { order, error, loading } = useSelector((state) => state.orderDetails);

  const dispatch = useDispatch();
  const alert = useAlert();

  const { id } = useParams();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(id, token));

    return () => {};
  }, [dispatch, alert, error, id, token]);

  return (
    <div className="app__top-margin">
      <MetaData title="Order Details - NixLab Shop" />

      <div className="flex-container">
        {loading ? (
          <div
            style={{
              margin: "2rem",
            }}
          >
            <Loader />
          </div>
        ) : (
          <div className="order-details-box">
            <div className="box-header">
              <p>Order Info</p>
            </div>

            <div className="details-box">
              <div className="info-tile">
                <p>Order ID</p>

                <span>#{order && order._id}</span>
              </div>

              <div className="info-tile">
                <p>Name</p>
                <span>{order.user && order.user.name}</span>
              </div>

              <div className="info-tile">
                <p>Phone</p>
                <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
              </div>

              <div className="info-tile">
                <p>Address</p>
                <span>
                  {order.shippingInfo &&
                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                </span>
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
              <p>Payment Info</p>
            </div>

            <div className="details-box">
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
                  {order.paymentInfo && order.paymentInfo.status === "succeeded"
                    ? "PAID"
                    : "NOT PAID"}
                </span>
              </div>

              <div className="info-tile">
                <p>Amount:</p>

                <span>
                  {currency.format(order.totalPrice && order.totalPrice)}
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
                      <Link to={`/products/${item.product}`}>{item.name}</Link>
                      <span>
                        {item.quantity} X ₹{currency.format(item.price)} ={" "}
                        <b>₹{currency.format(item.price * item.quantity)}</b>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppWrap(OrderDetails);
