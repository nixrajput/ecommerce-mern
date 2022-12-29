import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "react-alert";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { MdFace } from "react-icons/md";
import Logo from "../../../../assets/images/logo.png";
import { clearErrors, register } from "../../../../redux/actions/userAction";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";

function Register() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = userInput;

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
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
        <MetaData title="Register - NixLab Shop" />

        <form className="app__flex" onSubmit={registerSubmit}>
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

          <p className="title">Create an account</p>

          <div className="form-control">
            <MdFace />
            <input
              type="text"
              placeholder="Name"
              required
              disabled={loading}
              name="name"
              value={name}
              onChange={registerDataChange}
            />
          </div>
          <div className="form-control">
            <HiMail />
            <input
              type="email"
              placeholder="Email"
              required
              disabled={loading}
              name="email"
              value={email}
              onChange={registerDataChange}
            />
          </div>
          <div className="form-control">
            <HiLockClosed />
            <input
              type="password"
              placeholder="Password"
              required
              disabled={loading}
              name="password"
              value={password}
              onChange={registerDataChange}
            />
          </div>

          <input
            type="submit"
            value="Register"
            disabled={loading}
            className="rounded-filled-btn"
            style={{
              marginTop: 20,
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
              Already registered?
            </span>
            <Link to="/auth/login">Login here</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
