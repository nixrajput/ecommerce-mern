import "../Dashboard.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import {
  MdFace,
  MdVerified,
  MdMale,
  MdCalendarToday,
  MdCake,
} from "react-icons/md";
import { UPDATE_USER_RESET } from "../../../../redux/constants/userConstants";
import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../../../redux/actions/userAction";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import Loader from "../../../layout/loader/Loader";
import AppWrap from "../../../hoc/AppWrap";

function UpdateUser() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { id } = useParams();

  const { token, user: currentUser } = useSelector((state) => state.user);
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);
    myForm.set("dob", dob);
    myForm.set("gender", gender);

    dispatch(updateUser(id, myForm, token));
  };

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetails(id, token));
    } else {
      setName(user.name);
      setEmail(user.email);
      setGender(user.gender);
      setDOB(user.dob);
      setRole(user.role);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User Updated Successfully.");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    navigate,
    isUpdated,
    updateError,
    user,
    id,
    token,
  ]);

  return (
    <div className="app__top-margin">
      <MetaData title="Edit User - Admin Panel" />

      <div className="app__dashboard">
        <SideBar active="users" />

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
            <div className="title">Users</div>

            <form className="app__flex-card" onSubmit={updateUserSubmitHandler}>
              {updateLoading && <Loader />}

              <p className="title">Edit User</p>

              <div className="form-control">
                <MdFace />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  name="name"
                  disabled={updateLoading}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-control">
                <HiMail />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  name="email"
                  disabled={updateLoading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-control">
                <MdMale />
                <select
                  name="gender"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  disabled={updateLoading}
                >
                  <option value="" disabled={loading}>
                    Select
                  </option>
                  <option value="Male" disabled={loading}>
                    Male
                  </option>
                  <option value="Female" disabled={loading}>
                    Female
                  </option>
                  <option value="Others" disabled={loading}>
                    Others
                  </option>
                </select>
              </div>

              <div className="form-control">
                <MdCake />
                <input
                  type="date"
                  placeholder="DOB"
                  disabled={updateLoading}
                  min="1950-01-01"
                  max="2016-12-31"
                  name="dob"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                />
              </div>

              <div className="form-control">
                <MdVerified />
                <select
                  name="role"
                  value={role}
                  disabled={updateLoading}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="form-control">
                <MdCalendarToday />
                <input
                  type="text"
                  placeholder="Joined On"
                  disabled
                  name="createdAt"
                  value={new Date(user.createdAt)}
                />
              </div>

              <button
                className="rounded-filled-btn"
                style={{
                  marginTop: 20,
                }}
                type="submit"
                disabled={
                  updateLoading
                    ? true
                    : false || currentUser.role === "user"
                    ? true
                    : false
                }
              >
                Update
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppWrap(UpdateUser);
