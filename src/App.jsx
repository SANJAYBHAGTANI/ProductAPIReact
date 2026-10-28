import { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Landing_page from './componants/API';
import ProductDetails from './componants/ProductDetails';
import { BagIcon } from './componants/Icons';

function App() {
  // Kept here (not inside the list page) so products don't reload
  // every time the user comes back from a details page.
  const [allProducts, setAllProducts] = useState([]);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand" aria-label="Bhagtani Store home">
            <span className="brand-logo"><BagIcon size={20} /></span>
            <span className="brand-name">Bhagtani<span>Store</span></span>
          </Link>
          <Link to="/" className="nav-link">Shop all</Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Landing_page allProducts={allProducts} setAllProducts={setAllProducts} />}
        />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>

      <footer className="footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} Bhagtani Store</p>
          <p>Product data from DummyJSON</p>
        </div>
      </footer>
    </div>
  )
}

export default App
