import "../Dashboard.css";
import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from "chart.js";
import { getAdminProduct } from "../../../../redux/actions/productAction";
import { getAllOrders } from "../../../../redux/actions/orderAction";
import { getAllUsers } from "../../../../redux/actions/userAction";
import Sidebar from "../sidebar";
import MetaData from "../../../layout/MetaData";
import AppWrap from "../../../hoc/AppWrap";
import currency from "../../../helpers/currency";
import Loader from "../../../layout/loader/Loader";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
);

function Dashboard() {
  const dispatch = useDispatch();

  const { token, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  const [loading, setLoading] = useState(false);

  let outOfStock = 0;

  const options = {
    responsive: true,
  };

  const orderAmountList = [];

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  let totalAmount = 0;

  orders &&
    orders.forEach((item) => {
      orderAmountList.push(item.totalPrice);
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: orderAmountList
      .slice(
        orderAmountList.length > 5 ? Math.max(orderAmountList.length - 5, 0) : 0
      )
      .map((od, i) => `Order ${i + 1}`),
    datasets: [
      {
        label: "Total Amount",
        backgroundColor: ["#4CAF50"],
        hoverBackgroundColor: ["#4caf4fb6"],
        data: orderAmountList
          .slice(
            orderAmountList.length > 5
              ? Math.max(orderAmountList.length - 5, 0)
              : 0
          )
          .reverse(),
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#F44336", "#4CAF50"],
        hoverBackgroundColor: ["#f44336b6", "#4caf4fb6"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  useEffect(() => {
    async function fetchAll() {
      dispatch(getAdminProduct(token));
      dispatch(getAllOrders(token));
      dispatch(getAllUsers(token));
    }

    const fetchDashboardDetails = async () => {
      setLoading(true);

      await fetchAll();

      setLoading(false);
    };

    if (isAuthenticated && token) {
      fetchDashboardDetails();
    }

    return () => {};
  }, [dispatch, token, isAuthenticated]);

  return (
    <div className="app__top-margin">
      <div className="app__dashboard">
        <MetaData title="Dashboard - Admin Panel" />

        <Sidebar active="dashboard" />

        <div className="app__dashboard-container">
          <div className="title">Dashboard</div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="app__flex-card">
                <div className="chart-header">Overview</div>

                <div className="admin-tile-container">
                  <div className="admin-tile">
                    <p>Total Amount</p>

                    <span>₹{currency.format(totalAmount)}</span>
                  </div>

                  <div className="admin-tile">
                    <p>Product</p>

                    <span>{products && products.length}</span>
                  </div>

                  <div className="admin-tile">
                    <p>Orders</p>

                    <span>{orders && orders.length}</span>
                  </div>

                  <div className="admin-tile">
                    <p>Users</p>

                    <span>{users && users.length}</span>
                  </div>
                </div>
              </div>

              <div className="app__flex-card mt-2">
                <div className="chart-header">Order Summary</div>

                <div className="lineChart">
                  <Bar options={options} data={lineState} />
                </div>
              </div>

              <div className="app__flex-card mt-2">
                <div className="chart-header">Stock Summary</div>

                <div className="doughnutChart">
                  <Doughnut data={doughnutState} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppWrap(Dashboard);
