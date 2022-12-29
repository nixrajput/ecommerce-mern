import "../Dashboard.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DELETE_USER_RESET } from "../../../../redux/constants/userConstants";
import {
  getAllUsers,
  clearErrors,
  deleteUser,
} from "../../../../redux/actions/userAction";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import ProfileImg from "../../../../assets/images/profile.jpg";

function renderUserImage(params) {
  return (
    <img
      className="header-user-img"
      src={params.value ?? ProfileImg}
      alt="user"
    />
  );
}

function UserList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);
  const { error, users, loading } = useSelector((state) => state.allUsers);
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id, token));
  };

  const columns = [
    {
      field: "ind",
      headerName: "S. No.",
      minWidth: 80,
      flex: 0.2,
    },

    {
      field: "imgUrl",
      headerName: "User",
      minWidth: 80,
      flex: 0.3,
      renderCell: renderUserImage,
    },

    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "id",
      headerName: "User ID",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "role",
      headerName: "Role",
      minWidth: 100,
      flex: 0.3,
      renderCell: (params) => (
        <div
          className={
            params.value === "admin" ? "greenStatusBox" : "redStatusBox"
          }
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/users/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item, i) => {
      rows.push({
        ind: i + 1,
        id: item._id,
        imgUrl: item.avatar?.url,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers(token));

    return () => {};
  }, [
    dispatch,
    alert,
    error,
    deleteError,
    navigate,
    isDeleted,
    message,
    token,
  ]);

  return (
    <div className="app__top-margin">
      <MetaData title={`Users - Admin Panel`} />

      <div className="app__dashboard">
        <SideBar active="users" />

        <div className="app__dashboard-container">
          <div className="title">Users</div>

          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            autoHeight
            disableSelectionOnClick
            className="custom-list-table"
          />
        </div>
      </div>
    </div>
  );
}

export default AppWrap(UserList);
