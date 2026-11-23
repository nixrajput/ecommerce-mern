import "./NotFound.css";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="PageNotFound"
      style={{
        marginTop: 80,
      }}
    >
      <ErrorIcon />

      <p>Page Not Found</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default NotFound;
