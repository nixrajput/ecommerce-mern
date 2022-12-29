import "../Profile.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import { FiEdit } from "react-icons/fi";
import { BiRightArrowAlt } from "react-icons/bi";
import CustomTile from "../../../common/CustomTile";
import profilePng from "../../../../assets/images/profile.jpg";

function ProfileDetails() {
  const navigate = useNavigate();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/auth/login");
    }

    return () => { };
  }, [isAuthenticated, navigate]);

  return (
    <div className="app__top-margin">
      {loading ? (
        <Loader fullScreen={true} />
      ) : (
        user && (
          <div className="app__flex-container">
            <MetaData title={`${user.name} - NixLab Shop`} />

            <div className="app__flex-card">
              <div className="image-container">
                <img
                  src={user.avatar ? user.avatar.url : profilePng}
                  alt={user.name}
                />
              </div>

              <Link to="/user/profile/update" className="edit-profile-btn">
                <FiEdit /> Edit
              </Link>

              <div className="profile-details">
                <div className="name">{user.name}</div>

                <p
                  style={{
                    fontSize: 18,
                    color: "var(--grayColor)",
                    margin: "10px 0",
                    marginTop: "20px",
                  }}
                >
                  Basic Information
                </p>

                <CustomTile
                  leading={"Email"}
                  trailing={<a href={`mailto:${user.email}`}>{user.email}</a>}
                />

                <CustomTile
                  leading={"Joined On"}
                  trailing={String(user.createdAt).substring(0, 10)}
                />

                {user.gender && (
                  <CustomTile leading={"Gender"} trailing={user.gender} />
                )}

                {user.dob && user.dob !== undefined && user.dob !== "" && (
                  <CustomTile leading={"DOB"} trailing={user.dob} />
                )}

                <div className="actions">
                  <Link to="/orders">
                    My Orders <BiRightArrowAlt />{" "}
                  </Link>
                  <Link to="/auth/password/update">
                    Change Password <BiRightArrowAlt />{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default AppWrap(ProfileDetails);
