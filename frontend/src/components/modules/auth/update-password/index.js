import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { HiKey, HiLockClosed, HiLockOpen } from "react-icons/hi";
import { BiArrowBack } from "react-icons/bi";
import {
  clearErrors,
  updatePassword,
} from "../../../../redux/actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../../../redux/constants/userConstants";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";

function UpdatePassword() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, loading, isUpdated } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password Changed Successfully");

      navigate("/user/profile");

      dispatch({ type: UPDATE_PASSWORD_RESET });
    }

    return () => {};
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <div className="app__top-margin">
      <div className="app__flex-container">
        <MetaData title="Change Password - NixLab Shop" />

        <form className="app__flex-card" onSubmit={updatePasswordSubmit}>
          {loading && <Loader />}

          <p className="title">Change Password</p>

          <div className="form-control">
            <HiKey />
            <input
              type="password"
              placeholder="Old Password"
              required
              disabled={loading}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <HiLockClosed />
            <input
              type="password"
              placeholder="New Password"
              required
              disabled={loading}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            value="Change Password"
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
            <Link to="/user/profile">
              <BiArrowBack /> Back to Profile
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppWrap(UpdatePassword);
