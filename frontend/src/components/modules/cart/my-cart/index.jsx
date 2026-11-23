import "../Cart.css";
import { useEffect, useState } from "react";
import CartItemCard from "../cart-item-card";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsCartX } from "react-icons/bs";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import currency from "../../../helpers/currency";

function Cart() {
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [delCharge, setDelCharge] = useState(0);

  const checkoutHandler = () => {
    navigate("/auth/login?redirect=checkout/shipping");
  };

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );

      if (total > 20000) {
        setDiscount(total * 0.1);
      } else if (total > 10000) {
        setDiscount(1000);
      } else {
        setDiscount(0);
      }

      if (total < 1000) {
        setDelCharge(50);
      } else {
        setDelCharge(0);
      }

      setSubTotal(total + delCharge - discount);
    };

    calculateTotalAmount();

    return () => {};
  }, [cartItems, delCharge, discount]);

  return (
    <div className="app__top-margin">
      <MetaData title={`Cart - NixLab Shop`} />

      {cartItems.length === 0 ? (
        <div className="app__flex-container empty-cart">
          <BsCartX />

          <p>Your cart is empty.</p>

          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <div className="flex-container">
          <div className="app__cart-container">
            <div className="cart-items">
              <div className="box-header">
                <p>My Cart {`(${cartItems.length})`}</p>
              </div>

              {cartItems &&
                cartItems.map((item) => (
                  <CartItemCard key={item.product} item={item} />
                ))}
            </div>

            <div className="cart-amount-box">
              <div className="box-header">
                <p>Price Details</p>
              </div>

              <div className="sub-amount-box">
                <div className="price-tile">
                  <p className="title">
                    Price (
                    {`${cartItems.reduce(
                      (qty, item) => qty + item.quantity,
                      0
                    )} items`}
                    )
                  </p>

                  <p className="subtitle">
                    {`₹${currency.format(
                      cartItems.reduce(
                        (amt, item) => amt + item.quantity * item.price,
                        0
                      )
                    )}`}
                  </p>
                </div>

                <div className="price-tile">
                  <p className="title">Discount</p>

                  <p className="subtitle">
                    {discount > 0 ? (
                      <div className="greenColor">
                        {`- ₹${currency.format(discount)}`}
                      </div>
                    ) : (
                      "₹0"
                    )}
                  </p>
                </div>

                <div className="price-tile">
                  <p className="title">Delivery Charges</p>

                  <p className="subtitle">
                    {delCharge > 0 ? (
                      `₹${currency.format(delCharge)}`
                    ) : (
                      <div className="greenColor">FREE</div>
                    )}
                  </p>
                </div>
              </div>

              <div className="total-amount">
                <p className="title">Total Amount</p>

                <p className="subtitle">{`₹${currency.format(subTotal)}`}</p>
              </div>

              <div className="check-out-btn">
                <button
                  className="rounded-filled-btn"
                  onClick={checkoutHandler}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppWrap(Cart);
