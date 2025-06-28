import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthHeader from './pages/Auth UI/AuthHeader';
import Register from './pages/Auth UI/Register';
import Login from './pages/Auth UI/Login';
import ResetPassword from './pages/Auth UI/ResetPassword';
import CreateNewPassword from './pages/Auth UI/CreateNewPassword';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/auth" element={<AuthHeader />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="create-new-password" element={<CreateNewPassword />} />
          <Route path="verify-code" element={<Verification />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
