import "../Dashboard.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { MdStar, MdSearch } from "react-icons/md";
import { DELETE_REVIEW_RESET } from "../../../../redux/constants/productConstants";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../../../redux/actions/productAction";
import MetaData from "../../../layout/MetaData";
import SideBar from "../sidebar";
import AppWrap from "../../../hoc/AppWrap";

function ProductReviewList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );

  const { error, reviews, loading } = useSelector(
    (state) => state.productReviews
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews(reviewId, productId, token));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId, token));
  };

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.5,
    },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 220,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 80,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
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
          <>
            <button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </button>
          </>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId, token));
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }

    return () => {};
  }, [
    dispatch,
    alert,
    error,
    deleteError,
    navigate,
    isDeleted,
    productId,
    token,
  ]);

  return (
    <div className="app__top-margin">
      <MetaData title={`Reviews - Admin Panel`} />

      <div className="app__dashboard">
        <SideBar active={"products"} />

        <div className="app__dashboard-container">
          <div className="title">Reviews</div>

          <form onSubmit={productReviewsSubmitHandler} className="search-box">
            <div className="form-control">
              <MdStar />
              <input
                type="text"
                placeholder="Product Id"
                required
                disabled={loading}
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              {loading ? (
                "Searching..."
              ) : (
                <>
                  {" "}
                  <MdSearch /> <span>Search</span>{" "}
                </>
              )}
            </button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              autoHeight
              disableSelectionOnClick
              className="custom-list-table"
            />
          ) : (
            <p>No Reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppWrap(ProductReviewList);
