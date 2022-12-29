import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "react-alert";
import { HiMail, HiLockClosed } from "react-icons/hi";
import Logo from "../../../../assets/images/logo.png";
import { clearErrors, login } from "../../../../redux/actions/userAction";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";

function Login() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  useEffect(() => {
    let { from } = location.state || { from: { pathname: "/" } };

    if (location.search) {
      from = `/${location.search.split("=")[1]}`;
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(from);
    }

    return () => {};
  }, [dispatch, error, alert, navigate, isAuthenticated, location]);

  return (
    <>
      <div className="app__flex-container">
        <MetaData title="Login - NixLab Shop" />

        <form className="app__flex" onSubmit={loginSubmit}>
          {loading && <Loader />}

          <div
            className="logo"
            onClick={() => {
              navigate("/");
            }}
          >
            <img
              className="logo-img"
              width="100%"
              height="100%"
              src={Logo}
              alt="logo-img"
              loading="lazy"
            />
          </div>

          <p className="title">Login to account</p>

          <div className="form-control">
            <HiMail />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              disabled={loading}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <HiLockClosed />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              disabled={loading}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <Link to="/auth/password/forgot">Forgot Password ?</Link>
          </div>

          <input
            type="submit"
            value="Login"
            disabled={loading}
            className="rounded-filled-btn"
            style={{
              marginTop: 10,
            }}
          />

          <div
            className="form-control"
            style={{
              margin: 0,
              marginTop: 20,
            }}
          >
            <span
              style={{
                marginRight: 5,
                fontWeight: 600,
              }}
            >
              Don't have an account?
            </span>
            <Link to="/auth/register">Register here</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
