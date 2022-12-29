import "../Product.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import AppWrap from "../../../hoc/AppWrap";
import {
  getProducts,
  clearErrors,
} from "../../../../redux/actions/productAction";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import ProductCard from "../../../common/product-card";

const categories = [
  "All",
  "Laptop",
  "Mobile Phone",
  "Men's Wear",
  "Women's Wear",
  "Accessories",
  "Camera",
];

const Products = () => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [category, setCategory] = useState(categories[0]);
  const [ratings, setRatings] = useState(0);

  const { keyword } = useParams();

  const setCurrentPageNo = (e, v) => {
    setCurrentPage(v);
  };

  let count = filteredProductsCount;

  const totalPages = Math.ceil(productsCount / resultPerPage);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(
      getProducts(keyword, currentPage, minPrice, maxPrice, category, ratings)
    );
    return () => {};
  }, [
    dispatch,
    error,
    alert,
    keyword,
    currentPage,
    minPrice,
    maxPrice,
    category,
    ratings,
  ]);

  return (
    <div className="app__top-margin">
      <MetaData title="All Products - NixLab Shop" />

      <div className="flex-container">
        <div className="product-details-container">
          <div className="filter-box">
            <h1>Filters</h1>

            <div className="category-filter">
              <h2>Categories</h2>

              <ul className="category-list">
                {categories.map((item) => (
                  <li
                    className={
                      category === item
                        ? "category-link selected"
                        : "category-link"
                    }
                    item
                    key={item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="price-filter">
              <h2>Price</h2>

              <div className="price-range-input">
                <select
                  onChange={(e) => setMinPrice(e.target.value)}
                  value={minPrice}
                >
                  <option value="0">MIN</option>
                  <option value="100">₹100</option>
                  <option value="500">₹500</option>
                  <option value="1000">₹1000</option>
                  <option value="2000">₹2000</option>
                </select>

                <span>to</span>

                <select
                  onChange={(e) => setMaxPrice(e.target.value)}
                  value={maxPrice}
                >
                  <option value="50000">MAX</option>
                  <option value="100">₹100</option>
                  <option value="500">₹500</option>
                  <option value="1500">₹1500</option>
                  <option value="2500">₹2500</option>
                  <option value="5000">₹5000</option>
                  <option value="10000">₹10000</option>
                  <option value="50000">₹50000+</option>
                </select>
              </div>
            </div>

            <div className="rating-filter">
              <h2>Ratings</h2>

              <select
                onChange={(e) => setRatings(e.target.value)}
                value={ratings}
              >
                <option value="0">0★ & above</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
                <option value="2">2★ & above</option>
                <option value="1">1★ & above</option>
              </select>
            </div>
          </div>

          <div className="product-list-container">
            {loading ? (
              <div
                style={{
                  margin: "1rem",
                }}
              >
                <Loader />
              </div>
            ) : (
              products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>

        {resultPerPage < count && (
          <Pagination
            count={totalPages}
            onChange={setCurrentPageNo}
            showFirstButton
            showLastButton
          />
        )}
      </div>
    </div>
  );
};

export default AppWrap(Products);
