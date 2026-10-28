import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, ChevronRightIcon, ReturnIcon, ShieldIcon, Stars, TruckIcon } from './Icons';
import { formatPrice, originalPrice, prettyCategory } from './utils';
import './ProductDetails.css';

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// "Eleanor Collins" -> "EC"
const initials = (name = '') =>
    name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();

function ProductDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // List page product saath bhejta hai, toh page turant dikh jaata hai.
    // Agar page seedha khola gaya (refresh / shared link), toh id se API se mangwa lete hain.
    const passedProduct = location.state?.product;
    const [product, setProduct] = useState(
        passedProduct && String(passedProduct.id) === id ? passedProduct : null
    );
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (product && String(product.id) === id) return;

        let ignore = false;
        axios.get(`https://dummyjson.com/products/${id}`)
            .then((res) => {
                if (!ignore) setProduct(res.data);
            })
            .catch((err) => {
                console.error('Error fetching product:', err);
                if (!ignore) setError('This product could not be found.');
            });

        return () => {
            ignore = true;
        };
    }, [id, product]);

    // List se aaye ho toh wapas wahi list (search ke saath); warna home page
    const goBack = () => {
        if (location.key !== 'default') navigate(-1);
        else navigate('/');
    };

    const scrollToReviews = () => {
        document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (error) {
        return (
            <main className="container details-page">
                <div className="status-card">
                    <h2>Oops!!</h2>
                    <p>{error}</p>
                    <Link to="/" className="btn btn-primary">Back to store</Link>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="container details-page">
                <div className="status-card" role="status">
                    <div className="details-spinner" />
                    <p>Loading product...</p>
                </div>
            </main>
        );
    }

    const images = product.images?.length ? product.images : [product.thumbnail];
    const oldPrice = originalPrice(product);
    const discount = Math.round(product.discountPercentage);
    const status = product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock');
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    const reviews = product.reviews || [];

    const highlights = [
        { icon: TruckIcon, label: 'Delivery', value: product.shippingInformation || 'Fast delivery' },
        { icon: ShieldIcon, label: 'Warranty', value: product.warrantyInformation || 'Standard warranty' },
        { icon: ReturnIcon, label: 'Returns', value: product.returnPolicy },
    ].filter((item) => item.value);

    const specs = [
        ['Brand', product.brand || 'Generic Brand'],
        ['Category', prettyCategory(product.category)],
        ['SKU', product.sku],
        ['Stock', `${product.stock} units`],
        ['Weight', product.weight],
        ['Dimensions', product.dimensions &&
            `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} (W × H × D)`],
        ['Minimum Order', product.minimumOrderQuantity && `${product.minimumOrderQuantity} units`],
        ['Barcode', product.meta?.barcode],
    ].filter(([, value]) => value);

    return (
        <main className="container details-page">
            <div className="details-topbar">
                <button type="button" className="back-btn" onClick={goBack}>
                    <ArrowLeftIcon size={18} /> Back
                </button>
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRightIcon size={14} />
                    <Link to={`/?category=${encodeURIComponent(product.category)}`}>
                        {prettyCategory(product.category)}
                    </Link>
                    <ChevronRightIcon size={14} />
                    <span aria-current="page">{product.title}</span>
                </nav>
            </div>

            <section className="details-card details-main">
                <div className="details-gallery">
                    <div className="details-main-img">
                        <img src={images[activeImage]} alt={product.title} />
                        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
                    </div>

                    {images.length > 1 && (
                        <div className="details-thumbs">
                            {images.map((imgUrl, index) => (
                                <button
                                    type="button"
                                    key={imgUrl}
                                    className={index === activeImage ? 'active' : ''}
                                    aria-label={`Show image ${index + 1}`}
                                    aria-pressed={index === activeImage}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <img src={imgUrl} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="details-info">
                    <span className="details-category">{prettyCategory(product.category)}</span>
                    <h1>{product.title}</h1>
                    <p className="details-brand">by <strong>{product.brand || 'Generic Brand'}</strong></p>

                    <div className="details-rating">
                        <Stars value={product.rating} size={18} />
                        <span className="rating-number">{product.rating.toFixed(1)}</span>
                        {reviews.length > 0 && (
                            <button type="button" className="link-btn" onClick={scrollToReviews}>
                                {reviews.length} reviews
                            </button>
                        )}
                    </div>

                    <div className="price-box">
                        <div className="details-price">
                            <span className="price">{formatPrice(product.price)}</span>
                            {oldPrice && (
                                <>
                                    <span className="old-price">{formatPrice(oldPrice)}</span>
                                    <span className="discount-text">{discount}% off</span>
                                </>
                            )}
                        </div>
                        {oldPrice && (
                            <p className="details-save">You save {formatPrice(oldPrice - product.price)}</p>
                        )}
                    </div>

                    <p className={`stock-pill ${statusClass}`}>
                        <span className="dot" />
                        {status} · {product.stock} left
                    </p>

                    <p className="details-desc">{product.description}</p>

                    {highlights.length > 0 && (
                        <ul className="highlights">
                            {highlights.map(({ icon: HighlightIcon, label, value }) => (
                                <li key={label}>
                                    <span className="hl-icon"><HighlightIcon size={20} /></span>
                                    <div>
                                        <span className="hl-label">{label}</span>
                                        <span className="hl-value">{value}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {product.tags?.length > 0 && (
                        <div className="details-tags">
                            {product.tags.map((tag) => (
                                <span key={tag}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="details-card details-section">
                <h2>Product Information</h2>
                <dl className="details-specs">
                    {specs.map(([label, value]) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {reviews.length > 0 && (
                <section id="reviews" className="details-card details-section">
                    <h2>Customer Reviews</h2>
                    <div className="reviews-layout">
                        <div className="reviews-summary">
                            <span className="reviews-score">{product.rating.toFixed(1)}</span>
                            <Stars value={product.rating} size={20} />
                            <span>Based on {reviews.length} reviews</span>
                        </div>

                        <ul className="details-reviews">
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <span className="avatar" aria-hidden="true">{initials(review.reviewerName)}</span>
                                    <div className="review-body">
                                        <div className="review-head">
                                            <strong>{review.reviewerName}</strong>
                                            <span className="review-date">{formatDate(review.date)}</span>
                                        </div>
                                        <Stars value={review.rating} size={14} />
                                        <p>{review.comment}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </main>
    );
}

export default ProductDetails;
