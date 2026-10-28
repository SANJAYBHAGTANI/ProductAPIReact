// import { useState } from 'react';
// import axios from 'axios';
// import './API.css';

// function Landing_Page() {
//     const [searchItem, setsearchItem] = useState('');
//     const [products, setProducts] = useState([]); 
//     const [selectedItem, setselectedItem] = useState(null);

//     const FetchData = async (e) => {
//         e.preventDefault();
//         try {
//             const APIHere = await axios.get(`https://dummyjson.com/products/search?q=${searchItem}`);

//             setProducts(APIHere.data.products || []); 
            
//             setsearchItem('');
//         } catch (error) {
//             console.error("Api data Error:", error);
//         }
//     };

//     const showdetails = (product) => {
//         setselectedItem(product);
//     };

//     const closeDetails = () => {
//         setselectedItem(null);
//     };

//     return (
//         <>
//             <header>
//                 <h1 id="mainHeading">its your store "bhagtani"</h1>
//                 <h4 id="SubHeading">Discover millions of colorful products instantly</h4>
//             </header>
            
//             <main>
//                 <form onSubmit={FetchData}>
//                     <input 
//                         type="text" 
//                         placeholder="Search for Mobile, watches, gadgets..."
//                         value={searchItem}
//                         onChange={(e) => 
//                             setsearchItem(e.target.value)}/>
                            
//                     <button type="submit">Search</button>
//                 </form>

//                 <div id="SearchOutput">
//                     {products.map((product) => (
//                         <div key={product.id} className="product-card">
//                             <div className="imgAera">
//                                 <img src={product.thumbnail} alt={product.title} className="product-img" />
//                             </div>
//                             <div className="productDeatils">
//                                 <h3>{product.title}</h3>
//                                 <p className="product-desc">{product.description}</p>
                                
//                                 <div className="meta-info">
//                                     <span className="product-rating">⭐ {product.rating}</span>
//                                     <span className="product-brand">{product.brand || "Generic Brand"}</span>
//                                 </div>

//                                 <div className="price-tag-row">
//                                     <p className="product-price">Rs.{product.price}</p>
//                                     {product.discountPercentage > 0 && (
//                                         <span className="discount-badge">-{product.discountPercentage}% OFF</span>
//                                     )}
//                                 </div>

//                                 <button type='button' className='SearchBtn' onClick={() => showdetails(product)}>
//                                     More Details
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {selectedItem && (
//                     <div className="deatls" onClick={closeDetails}>
//                         <div className="popup-card" onClick={(e) => e.stopPropagation()}>
//                             <button className='close-btn' onClick={closeDetails}>&times;</button>
                            
//                             <div className="popup-header-img">
//                                 {selectedItem.images && selectedItem.images.map((imgUrl, index) => (
//                                 <img key={index} src={imgUrl} alt={`${selectedItem.title} ${index + 1}`} />
//                                 ))}
//                             </div>          

//                             <h2>{selectedItem.title}</h2>
//                             <p className="popup-desc">{selectedItem.description}</p>
                            
//                             <div className="popup-grid-info">
//                                 <p><strong>Price:</strong> Rs.{selectedItem.price}</p>
//                                 <p><strong>Brand:</strong> {selectedItem.brand || "N/A"}</p>
//                                 <p><strong>Category:</strong> {selectedItem.category}</p>
//                                 <p><strong>Stock:</strong> {selectedItem.stock} left</p>
//                                 <p><strong>Warranty:</strong> {selectedItem.warrantyInformation || "Standard"}</p>
//                                 <p><strong>Shipping:</strong> {selectedItem.shippingInformation || "Fast delivery"}</p>
//                             </div>

//                             <div className="popup-footer">
//                                 <span className="product-rating">⭐ {selectedItem.rating}</span>
//                                 <button className="SearchBtn" onClick={closeDetails}>Close Window</button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </>
//     );
// }

// export default Landing_Page;

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SearchIcon, StarIcon, XIcon } from './Icons';
import { formatPrice, originalPrice, prettyCategory } from './utils';
import './API.css';

const shuffleArray = (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// Title, description, category ya brand me search term match hota hai ya nahi
const matchesSearch = (item, query) =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    (item.brand && item.brand.toLowerCase().includes(query));

function ProductCard({ product }) {
    const oldPrice = originalPrice(product);
    const discount = Math.round(product.discountPercentage);
    const link = `/product/${product.id}`;

    return (
        <article className="product-card">
            {/* Image bhi details page kholti hai; keyboard users ke liye "More Details" button hi kaafi hai */}
            <Link to={link} state={{ product }} className="card-media" tabIndex={-1} aria-hidden="true">
                <img src={product.thumbnail} alt="" loading="lazy" />
                {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
            </Link>

            <div className="card-body">
                <span className="card-category">{prettyCategory(product.category)}</span>
                <h2 className="card-title">{product.title}</h2>
                <p className="card-desc">{product.description}</p>

                <div className="card-meta">
                    <span className="rating-pill"><StarIcon size={13} />{product.rating.toFixed(1)}</span>
                    <span className="card-brand">{product.brand || 'Generic Brand'}</span>
                </div>

                <div className="card-footer">
                    <div className="card-price">
                        <span className="price">{formatPrice(product.price)}</span>
                        {oldPrice && <span className="old-price">{formatPrice(oldPrice)}</span>}
                    </div>
                    {/* Product details ke page par le jaata hai; product saath bhej rahe hain taaki page turant khule */}
                    <Link to={link} state={{ product }} className="btn btn-primary">
                        More Details
                    </Link>
                </div>
            </div>
        </article>
    );
}

function SkeletonCard() {
    return (
        <div className="product-card skeleton-card" aria-hidden="true">
            <div className="card-media skeleton" />
            <div className="card-body">
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line medium" />
                <div className="skeleton skeleton-btn" />
            </div>
        </div>
    );
}

// allProducts App.jsx me rakha hai, taaki details page se wapas aane par list dobara load na ho.
// Search aur category URL me (?q=...&category=...) rehte hain, isliye Back dabane par bhi wahi results dikhte hain.
function Landing_Page({ allProducts, setAllProducts }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const [searchItem, setsearchItem] = useState(query);
    const [loadError, setLoadError] = useState(false);

    // Page load hote hi saare products fetch karke save kar lo (sirf pehli baar)
    useEffect(() => {
        if (allProducts.length > 0) return;

        const fetchAllProducts = async () => {
            try {
                // limit=0 = saare products (194). limit=100 se mobiles, tablets jaisi categories aati hi nahi thi
                const response = await axios.get('https://dummyjson.com/products?limit=0');
                // Random mix me dikhane ke liye ek baar shuffle karke save kar lo
                setAllProducts(shuffleArray(response.data.products || []));
            } catch (error) {
                console.error("Error fetching initial products:", error);
                setLoadError(true);
            }
        };

        fetchAllProducts();
    }, [allProducts.length, setAllProducts]);

    const updateFilters = (changes) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(changes).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
        });
        setSearchParams(next, { replace: true });
    };

    const FetchData = (e) => {
        e.preventDefault();
        updateFilters({ q: searchItem.trim() });
    };

    const clearFilters = () => {
        setsearchItem('');
        setSearchParams({}, { replace: true });
    };

    const categories = [...new Set(allProducts.map((item) => item.category))].sort();
    const q = query.toLowerCase();
    const products = allProducts.filter((item) =>
        (!category || item.category === category) && (!q || matchesSearch(item, q))
    );

    const isLoading = allProducts.length === 0 && !loadError;
    const isReady = !isLoading && !loadError;
    const hasFilters = Boolean(query || category);

    return (
        <main className="container store">
            <section className="hero">
                <div className="hero-content">
                    <h1>its your store "bhagtani"</h1>
                    <p className="hero-sub">Discover millions of colorful products instantly</p>

                    <form className="search-bar" role="search" onSubmit={FetchData}>
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            aria-label="Search products"
                            placeholder="Search for Mobile, watches, gadgets..."
                            value={searchItem}
                            onChange={(e) => setsearchItem(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>

                    {isReady && (
                        <p className="hero-stats">
                            {allProducts.length} products · {categories.length} categories
                        </p>
                    )}
                </div>
            </section>

            {categories.length > 0 && (
                <nav className="category-bar" aria-label="Categories">
                    <button
                        type="button"
                        className={`chip ${!category ? 'active' : ''}`}
                        aria-pressed={!category}
                        onClick={() => updateFilters({ category: '' })}
                    >
                        All
                    </button>
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`chip ${category === item ? 'active' : ''}`}
                            aria-pressed={category === item}
                            onClick={() => updateFilters({ category: item })}
                        >
                            {prettyCategory(item)}
                        </button>
                    ))}
                </nav>
            )}

            {isReady && (
                <div className="results-bar">
                    <p>
                        {hasFilters ? (
                            <>
                                Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
                                {query && <> for <strong>"{query}"</strong></>}
                                {category && <> in <strong>{prettyCategory(category)}</strong></>}
                            </>
                        ) : (
                            <>Showing all <strong>{products.length}</strong> products</>
                        )}
                    </p>
                    {hasFilters && (
                        <button type="button" className="btn-link" onClick={clearFilters}>
                            <XIcon size={16} /> Clear filters
                        </button>
                    )}
                </div>
            )}

            <div className="product-grid" aria-busy={isLoading}>
                {isLoading && (
                    <>
                        <p className="sr-only" role="status">Loading products...</p>
                        {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
                    </>
                )}

                {loadError && (
                    <div className="status-card">
                        <h2>Couldn't load products</h2>
                        <p>Please check your internet connection and try again.</p>
                        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                            Try again
                        </button>
                    </div>
                )}

                {/* Jab koi bhi item match nahi hoga toh yeh "Oops" card dikhega */}
                {isReady && products.length === 0 && (
                    <div className="status-card">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="" />
                        <h2>Oops!! Sorry, did not have this item</h2>
                        <p>Aapne jo search kiya hai woh filhal hamare store par available nahi hai. Kuch aur try karein!</p>
                        <button type="button" className="btn btn-primary" onClick={clearFilters}>
                            Show all products
                        </button>
                    </div>
                )}

                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}

export default Landing_Page;
