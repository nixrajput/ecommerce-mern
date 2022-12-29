import "../Product.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { useAlert } from "react-alert";
import Rating from "@mui/material/Rating";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FaStar, FaCartPlus } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";
import {
  getProductDetails,
  clearErrors,
  newReview,
} from "../../../../redux/actions/productAction";
import { addItemsToCart } from "../../../../redux/actions/cartAction";
import { NEW_REVIEW_RESET } from "../../../../redux/constants/productConstants";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import ReviewCard from "../../../common/ReviewCard";
import AppWrap from "../../../hoc/AppWrap";
import currency from "../../../helpers/currency";

function ProductDetails() {
  const { token, isAuthenticated } = useSelector((state) => state.user);
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity, token));
    alert.success("Item Added To Cart");
  };

  const buyProductHandler = () => {
    dispatch(addItemsToCart(id, quantity, token));
    alert.success("Item Added To Cart");
    navigate("/cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm, token));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Added Successfully.");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    if (id) {
      dispatch(getProductDetails(id));
    }

    return () => { };
  }, [dispatch, id, error, alert, reviewError, success]);

  return (
    <div className="app__top-margin">
      <MetaData title={`Buy ${product.name} - NixLab Shop`} />

      <div className="flex-container">
        {loading && <Loader />}

        <div className="product-details-container">
          <div className="product-carousel-box">
            {product.images && (
              <Carousel stopAutoPlayOnHover interval={10000}>
                {product.images.map((item, i) => {
                  return (
                    <img
                      className="carousel-img"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  );
                })}
              </Carousel>
            )}

            <div className="actions">
              <button
                className="rounded-filled-btn cart-btn"
                disabled={product.Stock < 1 ? true : false}
                onClick={addToCartHandler}
              >
                <FaCartPlus /> Add to Cart
              </button>

              <button
                className="rounded-filled-btn buy-btn"
                disabled={product.Stock < 1 ? true : false}
                onClick={buyProductHandler}
              >
                <MdFlashOn /> Buy Now
              </button>
            </div>
          </div>

          <div className="product-details-box">
            {product.name && <div className="name">{product.name}</div>}

            <div className="rating-container">
              <div
                className="rating-box"
                style={{
                  backgroundColor:
                    product.ratings <= 0
                      ? "gray"
                      : product.ratings < 2
                        ? "red"
                        : product.ratings < 4
                          ? "orange"
                          : "green",
                }}
              >
                <span>{Number(product.ratings).toFixed(1)}</span>
                <FaStar />
              </div>

              <p>{product.numOfReviews} Reviews</p>
            </div>

            {product.price && (
              <div className="price-qty-container">
                <h1>{`₹${currency.format(product.price)}`}</h1>

                <div className="qty-input">
                  <button onClick={decreaseQuantity}>-</button>
                  <input readOnly type="number" value={quantity} />
                  <button onClick={increaseQuantity}>+</button>
                </div>
              </div>
            )}

            <div className="stock-status-container">
              <span
                style={{
                  fontSize: "1.1rem",
                  color:
                    product.stock < 1
                      ? "red"
                      : product.stock < 5
                        ? "orange"
                        : "green",
                }}
              >
                {product.stock < 1
                  ? "Out Of Stock"
                  : product.stock < 5
                    ? "Only Few Left"
                    : "Available"}
              </span>
            </div>

            <div className="description-container">
              <div className="title">Description</div>

              <p>
                {product.description ? product.description : "No description."}
              </p>
            </div>

            <div className="review-container">
              <div className="title">
                <p>Reviews & Ratings</p>

                {isAuthenticated && (
                  <button onClick={submitReviewToggle} className="review-btn">
                    Add Review
                  </button>
                )}
              </div>

              <div className="review-list">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))
                ) : (
                  <p className="no-review">No Reviews.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog
          aria-labelledby="review-dialog-title"
          open={open}
          onClose={submitReviewToggle}
        >
          <DialogTitle>Add Review</DialogTitle>

          <DialogContent className="review-dialog">
            <form onSubmit={reviewSubmitHandler}>
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  minHeight: "5rem",
                  marginTop: "1rem",
                }}
                cols="30"
                rows="5"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="actions">
                <button
                  type="button"
                  onClick={submitReviewToggle}
                  className="rounded-filled-btn"
                  style={{
                    marginRight: "1rem",
                    backgroundColor: "var(--footerColor)",
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="rounded-filled-btn">
                  Submit
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AppWrap(ProductDetails);
