// Small inline SVG icons (Lucide style), so we don't need an icon library.
function Icon({ size = 20, children, ...props }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    );
}

export const SearchIcon = (props) => (
    <Icon {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
);

export const ArrowLeftIcon = (props) => (
    <Icon {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></Icon>
);

export const ChevronRightIcon = (props) => (
    <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>
);

export const XIcon = (props) => (
    <Icon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
);

export const BagIcon = (props) => (
    <Icon {...props}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </Icon>
);

export const TruckIcon = (props) => (
    <Icon {...props}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
    </Icon>
);

export const ShieldIcon = (props) => (
    <Icon {...props}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
    </Icon>
);

export const ReturnIcon = (props) => (
    <Icon {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </Icon>
);

export const StarIcon = (props) => (
    <Icon fill="currentColor" stroke="none" {...props}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Icon>
);

// 5 stars, filled up to the rating (works for half values like 3.6 too)
export function Stars({ value = 0, size = 16 }) {
    const percent = Math.max(0, Math.min(100, (value / 5) * 100));
    const row = [0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={size} />);

    return (
        <span className="stars" role="img" aria-label={`Rated ${value} out of 5`}>
            <span className="stars-empty">{row}</span>
            <span className="stars-fill" style={{ width: `${percent}%` }}>{row}</span>
        </span>
    );
}
