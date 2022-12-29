import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import LaunchIcon from "@mui/icons-material/Launch";
import { DataGrid } from "@mui/x-data-grid";
import { clearErrors, myOrders } from "../../../../redux/actions/orderAction";
import AppWrap from "../../../hoc/AppWrap";
import MetaData from "../../../layout/MetaData";
import Loader from "../../../layout/loader/Loader";
import currency from "../../../helpers/currency";

function MyOrders() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { token } = useSelector((state) => state.user);

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
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 80,
      flex: 0.3,
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
      minWidth: 80,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/orders/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item, i) => {
      rows.push({
        ind: i + 1,
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders(token));

    return () => {};
  }, [dispatch, alert, error, token]);

  return (
    <div className="app__top-margin">
      <MetaData title={`My Orders - NixLab Shop`} />

      <div className="flex-container">
        {loading ? (
          <div
            style={{
              margin: "2rem",
            }}
          >
            <Loader />
          </div>
        ) : (
          <div className="lg-padding-container">
            <DataGrid
              rows={rows}
              columns={columns}
              disableSelectionOnClick
              loading={loading}
              autoHeight
              className="custom-list-table"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AppWrap(MyOrders);
