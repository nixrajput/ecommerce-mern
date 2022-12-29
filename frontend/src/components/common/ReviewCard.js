import Rating from "@mui/material/Rating";

function ReviewCard({ review }) {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="review-card">
      <div className="header-area">
        <p className="user-name">{review.name}</p>

        <Rating {...options} />
      </div>

      <div className="desc">{review.comment}</div>
    </div>
  );
}

export default ReviewCard;
