import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import { BiArrowBack } from "react-icons/bi";
import {
  clearErrors,
  resetPassword,
} from "../../../../redux/actions/userAction";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import Logo from "../../../../assets/images/logo.png";
import { RESET_PASSWORD_RESET } from "../../../../redux/constants/userConstants";

function ResetPassword() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { token } = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(token, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");

      navigate("/auth/login");

      dispatch({
        type: RESET_PASSWORD_RESET,
      });
    }

    return () => {};
  }, [dispatch, error, alert, navigate, success]);

  return (
    <>
      <div className="app__flex-container">
        <MetaData title="Reset Password - NixLab Shop" />
        <form className="app__flex" onSubmit={resetPasswordSubmit}>
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

          <p className="title">Reset Password</p>

          <p className="subtitle">Create your new password</p>

          <div className="form-control">
            <HiLockClosed />
            <input
              type="password"
              placeholder="New Password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-control">
            <HiLockOpen />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Reset Password"
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
            <Link to="/auth/login">
              <BiArrowBack /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
