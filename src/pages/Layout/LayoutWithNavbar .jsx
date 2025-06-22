// LayoutWithNavbar.jsx

import { Outlet } from 'react-router-dom';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';

const LayoutWithNavbar = () => (
  <>
    <Navbar />
    
    <Footer />
  </>
);

export default LayoutWithNavbar;
