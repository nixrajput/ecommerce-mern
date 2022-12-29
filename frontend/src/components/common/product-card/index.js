import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import currency from "../../helpers/currency";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const options = {
    size: "large",
    value: Number(product.ratings).toFixed(2),
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <img
        className="product-img"
        src={product.images[0].url}
        alt={product.name}
        loading="lazy"
      />

      <p>{product.name}</p>

      <Rating {...options} />

      <span className="price">{`₹${currency.format(product.price)}`}</span>
    </div>
  );
}

export default ProductCard;
