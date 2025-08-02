import Navbar from './Home/Navbar';
import Footer from './Home/Footer';
import { Link } from 'react-router-dom';

const ErrorPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white">
          <div className="p-4 md:p-6 lg:p-8">
      
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-light text-black mb-2 tracking-wide">
                404 - Page Not Found
              </h3>
              <p className="text-gray-600 font-light mb-6">
                The page you are looking for doesn't exist or has been moved.
              </p>
              <Link to="/">
                <button className="bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide">
                  GO TO HOMEPAGE
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default ErrorPage;