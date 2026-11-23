import "../Checkout.css";
import "../../cart/Cart.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AppWrap from "../../../hoc/AppWrap";
import MetaData from "../../../layout/MetaData";
import CheckoutSteps from "../checkout-steps";
import currency from "../../../helpers/currency";

function OrderSummary() {
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 50;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/checkout/payment");
  };

  return (
    <div className="app__top-margin">
      <MetaData title="Order Summary - NixLab Shop" />

      <div className="flex-container">
        <CheckoutSteps activeStep={1} />

        <div
          className="app__checkout-container"
          style={{
            marginTop: "2rem",
          }}
        >
          <div className="summary-items">
            <div className="box-header">
              <p>Shipping Info</p>
            </div>

            <div className="shipping-info">
              <div className="info-tile">
                <p>Name</p>
                <span>{user.name}</span>
              </div>

              <div className="info-tile">
                <p>Phone</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>

              <div className="info-tile">
                <p>Address</p>
                <span>{address}</span>
              </div>
            </div>

            <div className="cart-items">
              <div className="box-header">
                <p>Your Items</p>
              </div>

              <div className="item-list">
                {cartItems &&
                  cartItems.map((item) => (
                    <div key={item.product} className="item-card">
                      <img src={item.image} alt="Product" />

                      <div className="details">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                        <span>
                          {item.quantity} X ₹{currency.format(item.price)} ={" "}
                          <b>₹{currency.format(item.price * item.quantity)}</b>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="cart-amount-box">
            <div className="box-header">
              <p>Order Summary</p>
            </div>

            <div className="sub-amount-box">
              <div className="price-tile">
                <p className="title">Subtotal</p>

                <p className="subtitle">₹{currency.format(subtotal)}</p>
              </div>

              <div className="price-tile">
                <p className="title">GST</p>

                <p className="subtitle">₹{currency.format(tax)}</p>
              </div>
            </div>

            <div className="total-amount">
              <p className="title">Total</p>

              <p className="subtitle">{`₹${currency.format(totalPrice)}`}</p>
            </div>

            <div className="check-out-btn">
              <button className="rounded-filled-btn" onClick={proceedToPayment}>
                Proceed To Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppWrap(OrderSummary);
