import "../Dashboard.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../../../redux/actions/orderAction";
import { DELETE_ORDER_RESET } from "../../../../redux/constants/orderConstants";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import currency from "../../../helpers/currency";

function OrderList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);
  const { error, orders, loading } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id, token));
  };

  const columns = [
    {
      field: "ind",
      headerName: "S. No.",
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: "id",
      headerName: "Order ID",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <div
            className={
              params.value === "Delivered"
                ? "greenStatusBox"
                : params.value === "Shipped"
                ? "orangeStatusBox"
                : "redStatusBox"
            }
          >
            {" "}
            {params.value}{" "}
          </div>
        );
      },
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        return `₹${currency.format(params.value)}`;
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "",
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/orders/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
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

  orders &&
    orders.forEach((item, i) => {
      rows.push({
        ind: i + 1,
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
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
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders(token));

    return () => {};
  }, [dispatch, alert, error, token, deleteError, navigate, isDeleted]);

  return (
    <div className="app__top-margin">
      <MetaData title="Orders - Admin Panel" />

      <div className="app__dashboard">
        <SideBar active={"orders"} />

        <div className="app__dashboard-container">
          <div className="title">Orders</div>

          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            loading={loading}
            autoHeight
            className="custom-list-table"
          />
        </div>
      </div>
    </div>
  );
}

export default AppWrap(OrderList);
