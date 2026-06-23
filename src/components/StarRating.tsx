export default function StarRating({
  value,
  size = 16,
}: {
  value: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value >= n - 0.25;
        return (
          <svg key={n} width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path
              d="M10 1.5l2.6 5.6 6.1.6-4.6 4 1.4 6-5.5-3.3-5.5 3.3 1.4-6-4.6-4 6.1-.6L10 1.5Z"
              fill={filled ? "var(--color-brass)" : "transparent"}
              stroke="var(--color-brass)"
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
}
