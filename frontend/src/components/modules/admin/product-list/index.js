import "../Dashboard.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MdPostAdd } from "react-icons/md";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../../../redux/actions/productAction";
import { DELETE_PRODUCT_RESET } from "../../../../redux/constants/productConstants";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import currency from "../../../helpers/currency";

function ProductList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);
  const { error, products, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

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
      alert.success("Product Deleted Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProduct(token));

    return () => {};
  }, [dispatch, alert, error, token, deleteError, navigate, isDeleted]);

  const columns = [
    {
      field: "ind",
      headerName: "S. No.",
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "id",
      headerName: "Product ID",
      minWidth: 200,
      flex: 0.5,
    },

    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 120,
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
            <Link to={`/admin/products/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
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

  products &&
    products.forEach((item, i) => {
      rows.push({
        ind: i + 1,
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <div className="app__top-margin">
      <MetaData title={`Products - Admin Panel`} />

      <div className="app__dashboard">
        <SideBar active={"products"} />

        <div className="app__dashboard-container">
          <div className="title">Products</div>

          <Link className="action-btn" to="/admin/product/new">
            <MdPostAdd />
            Add
          </Link>

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

export default AppWrap(ProductList);
