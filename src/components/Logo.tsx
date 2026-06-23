import Link from "next/link";
import WormMark from "./WormMark";

export default function Logo({ tagline = false }: { tagline?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:rounded-sm"
    >
      <WormMark className="shrink-0 transition-transform duration-300 group-hover:rotate-12" />
      <span className="flex flex-col leading-none">
        <span
          className="text-2xl tracking-tight text-ink"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          The Paperworm
        </span>
        {tagline && (
          <span
            className="text-[11px] tracking-[0.18em] uppercase text-ink-soft mt-1"
            style={{ fontFamily: "var(--font-stamp)" }}
          >
            Books, slightly gnawed at the edges
          </span>
        )}
      </span>
    </Link>
  );
}
