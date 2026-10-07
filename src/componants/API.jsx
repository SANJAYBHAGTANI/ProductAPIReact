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
import axios from 'axios';
import './API.css';

function Landing_Page() {
    const [searchItem, setsearchItem] = useState('');
    const [products, setProducts] = useState([]); 
    const [allProducts, setAllProducts] = useState([]); // Saare products yahan save rahenge
    const [selectedItem, setselectedItem] = useState(null);

    const shuffleArray = (array) => {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Page load hote hi saare products fetch karke save kar lo
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get('https://dummyjson.com/products?limit=100');
                const productsList = response.data.products || [];
                setAllProducts(productsList); // Backup mein saare products rakh liye
                
                // Pehli baar random mix products dikhao
                setProducts(shuffleArray(productsList).slice(0, 120)); 
            } catch (error) {
                console.error("Error fetching initial products:", error);
            }
        };

        fetchAllProducts();
    }, []);

    // Smart Local Search Function (Har word ke liye automatically kaam karega)
    const FetchData = (e) => {
        e.preventDefault();
        const query = searchItem.trim().toLowerCase();

        if (query === '') return;

        // Saare products me se check karo ki title, description ya category me search term match hota hai ya nahi
        const filteredProducts = allProducts.filter((item) => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            (item.brand && item.brand.toLowerCase().includes(query))
        );

        setProducts(filteredProducts);
        setsearchItem('');
    };

    const showdetails = (product) => {
        setselectedItem(product);
    };

    const closeDetails = () => {
        setselectedItem(null);
    };

    return (
        <>
            <header>
                <h1 id="mainHeading">its your store "bhagtani"</h1>
                <h4 id="SubHeading">Discover millions of colorful products instantly</h4>
            </header>
            
            <main>
                <form onSubmit={FetchData}>
                    <input 
                        type="text" 
                        placeholder="Search for Mobile, watches, gadgets..."
                        value={searchItem}
                        onChange={(e) => setsearchItem(e.target.value)}/>

                    <button type="submit">Search</button>
                </form>

                <div id="SearchOutput">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="imgAera">
                                    <img src={product.thumbnail} alt={product.title} className="product-img" />
                                </div>
                                <div className="productDeatils">
                                    <h3>{product.title}</h3>
                                    <p className="product-desc">{product.description}</p>
                                    
                                    <div className="meta-info">
                                        <span className="product-rating">⭐ {product.rating}</span>
                                        <span className="product-brand">{product.brand || "Generic Brand"}</span>
                                    </div>

                                    <div className="price-tag-row">
                                        <p className="product-price">Rs.{product.price}</p>
                                        {product.discountPercentage > 0 && (
                                            <span className="discount-badge">-{product.discountPercentage}% OFF</span>
                                        )}
                                    </div>

                                    <button type='button' className='SearchBtn' onClick={() => showdetails(product)}>
                                        More Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Jab koi bhi item match nahi hoga toh yeh sundar "Oops" card dikhega */
                        <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1', background: 'var(--card-bg)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" 
                                alt="No Item Found" 
                                style={{ width: '130px', height: '130px', objectFit: 'contain', marginBottom: '20px' }} 
                            />
                            <h2 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>Oops!! Sorry, did not have this item</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Aapne jo search kiya hai woh filhal hamare store par available nahi hai. Kuch aur try karein!</p>
                        </div>
                    )}
                </div>

                {selectedItem && (
                    <div className="deatls" onClick={closeDetails}>
                        <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                            <button className='close-btn' onClick={closeDetails}>&times;</button>
                            
                            <div className="popup-header-img">
                                {selectedItem.images && selectedItem.images.map((imgUrl, index) => (
                                <img key={index} src={imgUrl} alt={`${selectedItem.title} ${index + 1}`} />
                                ))}
                            </div>          

                            <h2>{selectedItem.title}</h2>
                            <p className="popup-desc">{selectedItem.description}</p>
                            
                            <div className="popup-grid-info">
                                <p><strong>Price:</strong> Rs.{selectedItem.price}</p>
                                <p><strong>Brand:</strong> {selectedItem.brand || "N/A"}</p>
                                <p><strong>Category:</strong> {selectedItem.category}</p>
                                <p><strong>Stock:</strong> {selectedItem.stock} left</p>
                                <p><strong>Warranty:</strong> {selectedItem.warrantyInformation || "Standard"}</p>
                                <p><strong>Shipping:</strong> {selectedItem.shippingInformation || "Fast delivery"}</p>
                            </div>

                            <div className="popup-footer">
                                <span className="product-rating">⭐ {selectedItem.rating}</span>
                                <button className="SearchBtn" onClick={closeDetails}>Close Window</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

export default Landing_Page;