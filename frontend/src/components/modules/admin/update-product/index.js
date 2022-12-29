import "../Dashboard.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdAttachMoney,
  MdCategory,
  MdDescription,
  MdSpellcheck,
  MdStore,
} from "react-icons/md";
import { UPDATE_PRODUCT_RESET } from "../../../../redux/constants/productConstants";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../../../redux/actions/productAction";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import Loader from "../../../layout/loader/Loader";

function UpdateProduct() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { id } = useParams();

  const { token } = useSelector((state) => state.user);
  const { error, product } = useSelector((state) => state.productDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const categories = [
    "Laptop",
    "Mobile Phone",
    "Men's Wear",
    "Women's Wear",
    "Accessories",
    "Camera",
  ];

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateProduct(id, myForm, token));
    dispatch(getProductDetails(id));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }

    return () => {};
  }, [dispatch, alert, error, navigate, isUpdated, id, product, updateError]);

  return (
    <div className="app__top-margin">
      <MetaData title="Edit Product - Admin Panel" />

      <div className="app__dashboard">
        <SideBar active="products" />

        <div className="app__dashboard-container">
          <form
            className="app__flex-card"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            {loading && (
              <div
                style={{
                  marginBottom: 10,
                }}
              >
                <Loader />
              </div>
            )}

            <p className="title">Edit Product</p>

            <div className="form-control">
              <MdSpellcheck />
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <MdDescription />
              <input
                name="description"
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control">
              <MdAttachMoney />
              <input
                type="number"
                name="price"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>

            <div className="form-control">
              <MdCategory />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <MdStore />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
                value={stock}
              />
            </div>

            <div className="file-input">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            <div className="image-list-preview">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>

            <div className="image-list-preview">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <button
              className="rounded-filled-btn"
              type="submit"
              style={{
                marginTop: 20,
              }}
              disabled={loading ? true : false}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppWrap(UpdateProduct);
