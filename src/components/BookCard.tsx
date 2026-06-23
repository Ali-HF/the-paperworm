import Link from "next/link";
import BookCover from "./BookCover";
import { formatPrice, type Book } from "@/lib/db";
import { addToCartAction } from "@/app/actions/cart-actions";

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="group flex flex-col">
      <Link
        href={`/shop/${book.id}`}
        className="block rounded-xl overflow-hidden shadow-[0_6px_18px_-6px_rgba(34,29,24,0.35)]
                   ring-1 ring-ink/10 transition-all duration-300 group-hover:-translate-y-1 
                   group-hover:shadow-[0_12px_24px_-8px_rgba(34,29,24,0.45)]"
      >
        <BookCover
          title={book.title}
          author={book.author}
          genre={book.genre}
          seed={book.cover_seed}
          className="w-full h-auto"
        />
      </Link>

      <div className="mt-3 flex-1 flex flex-col">
        <Link href={`/shop/${book.id}`} className="trail-link">
          <h3
            className="text-base leading-snug"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-ink-soft mt-0.5">{book.author}</p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span
            className="text-sm px-2 py-0.5 rounded-sm bg-parchment-dark text-ink"
            style={{ fontFamily: "var(--font-stamp)" }}
          >
            {formatPrice(book.price_cents)}
          </span>

          {book.stock > 0 ? (
            <form action={addToCartAction.bind(null, book.id, 1)}>
              <button
                type="submit"
                className="text-xs px-3 py-1.5 rounded-full bg-oxblood text-cream hover:bg-oxblood-dark
                           transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-stamp)" }}
              >
                ADD
              </button>
            </form>
          ) : (
            <span className="text-xs text-ink-soft/70" style={{ fontFamily: "var(--font-stamp)" }}>
              SOLD OUT
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
