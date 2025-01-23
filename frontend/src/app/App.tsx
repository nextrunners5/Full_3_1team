import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "../pages/home/MainPage";
import TestPage from "../pages/home/TestPage";
import Login from "../pages/login/Login";
import ProductCreate from "../pages/product/ProductCreate";
import Cart from "../pages/cart/Cart";
import Order from "../pages/order/Order";
import Payment from "../pages/payments/Payments";
import FindAccount from '../pages/login/FindAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<TestPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product" element={<ProductCreate />} />
        <Route path="/find-account" element={<FindAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
