import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import {
  FaCity,
  FaGlobe,
  FaHome,
  FaKey,
  FaLocationArrow,
  FaPhone,
} from "react-icons/fa";
import { saveShippingInfo } from "../../../../redux/actions/cartAction";
import AppWrap from "../../../hoc/AppWrap";
import MetaData from "../../../layout/MetaData";
import CheckoutSteps from "../checkout-steps";

function Shipping() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingInfo({
        address,
        city,
        state,
        country,
        pinCode,
        phoneNo,
      })
    );
    navigate("/checkout/summary");
  };

  return (
    <div className="app__top-margin">
      <MetaData title={`Shipping Details - NixLab Shop`} />

      <div className="flex-container">
        <CheckoutSteps activeStep={0} />

        <form
          className="app__flex-card"
          style={{
            marginTop: "2rem",
          }}
          encType="multipart/form-data"
          onSubmit={shippingSubmit}
        >
          <div className="form-control">
            <FaHome />
            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-control">
            <FaCity />
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-control">
            <FaKey />
            <input
              type="number"
              placeholder="Pin Code"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>

          <div className="form-control">
            <FaPhone />
            <input
              type="number"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              size="10"
            />
          </div>

          <div className="form-control">
            <FaGlobe />
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {country && (
            <div className="form-control">
              <FaLocationArrow />

              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">State</option>
                {State &&
                  State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <input
            type="submit"
            value="Continue"
            className="rounded-filled-btn"
            style={{
              marginTop: "1rem",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default AppWrap(Shipping);
