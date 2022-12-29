import "../Dashboard.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import {
  MdAttachMoney,
  MdCategory,
  MdDescription,
  MdSpellcheck,
  MdStore,
} from "react-icons/md";
import { NEW_PRODUCT_RESET } from "../../../../redux/constants/productConstants";
import {
  clearErrors,
  createProduct,
} from "../../../../redux/actions/productAction";
import SideBar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import Loader from "../../../layout/loader/Loader";

function NewProduct() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Mobile Phone",
    "Men's Wear",
    "Women's Wear",
    "Accessories",
    "Camera",
  ];

  const createProductSubmitHandler = (e) => {
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
    dispatch(createProduct(myForm, token));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

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
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }

    return () => {};
  }, [dispatch, alert, error, navigate, success]);

  return (
    <div className="app__top-margin">
      <MetaData title="Create Product - Admin Panel" />

      <div className="app__dashboard">
        <SideBar active="products" />

        <div className="app__dashboard-container">
          <form
            className="app__flex-card"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
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

            <p className="title">Create Product</p>

            <div className="form-control">
              <MdSpellcheck />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <MdDescription />
              <input
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control">
              <MdAttachMoney />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-control">
              <MdCategory />
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select</option>
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
              />
            </div>

            <div
              className="file-input"
              style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="file"
                name="avatar"
                accept="image/*"
                max={10}
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div className="image-list-preview">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <button
              className="rounded-filled-btn"
              type="submit"
              disabled={loading ? true : false}
              style={{
                marginTop: 20,
              }}
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppWrap(NewProduct);
