import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "../pages/home/MainPage";
import TestPage from "../pages/home/TestPage";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import Order from "../pages/order/Order";
import Payment from "../pages/payments/Payments";
import ProductCreate from "../pages/product/ProductCreate";
import ProductList from "../pages/product/ProductList";
import ProductDetail from "../pages/product/ProductDetail";
import Wishlist from "../pages/wishlist/WishList";

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
        <Route path="/ProductCreate" element={<ProductCreate />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/products/:product_id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  );
}

export default App;
