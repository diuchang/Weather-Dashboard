interface Props {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({ size = 20, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`animate-spin ${className}`}
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="#1e2d4a" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
