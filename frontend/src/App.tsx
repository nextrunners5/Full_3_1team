import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from './pages/MainPage';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import ProductCreate from './pages/ProductCreate';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Payment from './pages/Payment';

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
        
      </Routes>
    </Router>
  )
}

export default App
