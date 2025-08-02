import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthHeader from './pages/Auth UI/AuthHeader';
import Register from './pages/Auth UI/Register';
import Login from './pages/Auth UI/Login';
import ResetPassword from './pages/Auth UI/ResetPassword';
import Verification from './pages/Auth UI/Verification';
import Home from './pages/Home/Home';
import Product from './pages/Products/Product';
import './App.css';
import LayoutWithNavbar from './pages/Layout/LayoutWithNavbar ';
import SingleProductPage from './pages/Products/SingleProductPage';
import CartPage from './pages/Products/CartPage';
import Profile from './pages/Dashboard/Profile';
import AddProduct from './pages/Seller/AddProduct';
import Order from './pages/Dashboard/Order';
import Checkout from './pages/Dashboard/Checkout';
import SuccessPage from './pages/Home/SuccessPage';
import Whishlist from './pages/Dashboard/Whishlist';
import Dashboard from './pages/Admin/Dashboard';
import AllUser from './pages/Admin/AllUser';
import SetNewPassword from './pages/Auth UI/SetNewPassword';
import ErrorPage from './pages/ErrorPage';
import AllOrder from './pages/Admin/AllOrder';
import ManageProduct from './pages/Admin/ManageProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/auth" element={<AuthHeader />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-code" element={<Verification />} />
          <Route path="reset-password/:token" element={<SetNewPassword />} />
        </Route>

        {/* MAIN ROUTES */}
        <Route path="/" element={<LayoutWithNavbar />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="product" element={<Product />} />
          <Route path="product/:id" element={<SingleProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<Order />} />
          <Route path="check-out" element={<Checkout />} />                  
          <Route path="success" element={<SuccessPage />} />
          <Route path="wishlist" element={<Whishlist />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<AllUser />} />
        <Route path="/admin/orders" element={<AllOrder />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/manage-product" element={<ManageProduct />} />

        {/* Catch-all error route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
