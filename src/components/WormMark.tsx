export default function WormMark({
  className = "",
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* bitten paper hole */}
      <path
        d="M20 5.5c4.8-.4 8.6 1.1 11.2 4.6 2.6 3.4 3.5 7.4 2 11.6-1.4 4-4.3 7.1-8.6 8.7-4.4 1.6-9 1.1-12.7-1.6-3.6-2.7-5.6-6.4-5.4-10.8.2-4.1 2.1-7.6 5.7-9.9C15.1 6.2 17.4 5.7 20 5.5Z"
        fill="#1a140f"
      />
      <path
        d="M21 9.2c3.4-.2 6 .9 8 3.3 1.9 2.4 2.5 5.1 1.4 8-1.1 2.9-3.2 4.9-6.2 5.9-3 1-6.1.6-8.6-1.3-2.4-1.9-3.6-4.4-3.4-7.4.2-2.8 1.6-5.1 4-6.7 1.5-1 3-1.6 4.8-1.8Z"
        fill="var(--color-parchment)"
      />
      {/* worm peeking through */}
      <path
        d="M14 22c1.4 1.8 1.2 3.6-.4 5.2-1.3 1.3-1.4 2.5-.3 3.7"
        stroke="var(--color-oxblood)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="13.2" cy="21" r="0.9" fill="var(--color-charcoal)" />
    </svg>
  );
}
