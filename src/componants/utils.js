// "home-decoration" -> "Home Decoration"
export const prettyCategory = (category = '') =>
    category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// 1899.5 -> "₹1,899.50"
export const formatPrice = (value) =>
    `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Price before the discount, worked out from the current price and discount %
export const originalPrice = (product) =>
    product.discountPercentage > 0 ? product.price / (1 - product.discountPercentage / 100) : null;
