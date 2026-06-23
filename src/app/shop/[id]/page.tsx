import { notFound } from "next/navigation";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import WormDivider from "@/components/WormDivider";
import {
  getBook,
  formatPrice,
  getReviewsForBook,
  getRatingSummary,
} from "@/lib/db";
import { addToCartWithQtyAction } from "@/app/actions/cart-actions";
import { auth } from "@/lib/auth";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = Number(id);
  const book = await getBook(bookId);
  if (!book) notFound();

  const session = await auth();
  const reviews = await getReviewsForBook(bookId);
  const summary = await getRatingSummary(bookId);
  const maxQty = Math.min(book.stock, 10);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/shop" className="trail-link text-sm text-ink-soft" style={{ fontFamily: "var(--font-stamp)" }}>
        ← BACK TO SHOP
      </Link>

      <div className="mt-6 grid sm:grid-cols-[280px_1fr] gap-12">
        <div className="rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(34,29,24,0.4)] ring-1 ring-ink/10 h-fit">
          <BookCover
            title={book.title}
            author={book.author}
            genre={book.genre}
            seed={book.cover_seed}
            className="w-full h-auto"
          />
        </div>

        <div>
          <Link
            href={`/shop?genre=${encodeURIComponent(book.genre)}`}
            className="trail-link text-xs tracking-[0.18em] uppercase text-oxblood"
            style={{ fontFamily: "var(--font-stamp)" }}
          >
            {book.genre}
          </Link>
          <h1
            className="mt-2 text-4xl leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {book.title}
          </h1>
          <p className="mt-1 text-lg text-ink-soft">{book.author}</p>

          <div className="mt-3 flex items-center gap-2">
            <StarRating value={summary.avg} />
            <span className="text-sm text-ink-soft">
              {summary.count > 0
                ? `${summary.avg.toFixed(1)} (${summary.count} ${summary.count === 1 ? "review" : "reviews"})`
                : "No reviews yet"}
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-ink-soft max-w-prose">
            {book.description}
          </p>

          <div
            className="mt-6 text-2xl"
            style={{ fontFamily: "var(--font-stamp)" }}
          >
            {formatPrice(book.price_cents)}
          </div>

          <div className="mt-6">
            {book.stock > 0 ? (
              <form
                action={addToCartWithQtyAction.bind(null, book.id)}
                className="flex items-center gap-3"
              >
                <label htmlFor="qty" className="sr-only">
                  Quantity
                </label>
                <select
                  id="qty"
                  name="qty"
                  defaultValue="1"
                  className="rounded-md border border-ink/20 bg-cream px-3 py-2.5 text-sm focus:border-oxblood"
                >
                  {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-oxblood text-cream hover:bg-oxblood-dark
                             transition-colors text-sm cursor-pointer"
                  style={{ fontFamily: "var(--font-stamp)" }}
                >
                  ADD TO CART
                </button>
                <span className="text-sm text-ink-soft">{book.stock} left</span>
              </form>
            ) : (
              <p className="text-oxblood text-sm" style={{ fontFamily: "var(--font-stamp)" }}>
                SOLD OUT
              </p>
            )}
          </div>

          <p className="mt-4 text-xs text-ink-soft/70">SKU {book.isbn}</p>
        </div>
      </div>

      <WormDivider className="my-14" />

      <section>
        <h2
          className="text-2xl mb-6"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Customer reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-ink-soft mb-8">No one&apos;s reviewed this one yet — be the first.</p>
        ) : (
          <ul className="space-y-6 mb-10 max-w-prose">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-ink/10 pb-5">
                <div className="flex items-center gap-3">
                  <StarRating value={r.rating} size={14} />
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                    {r.user_name}
                  </span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-ink-soft leading-relaxed">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}

        {session?.user ? (
          <ReviewForm bookId={book.id} />
        ) : (
          <p className="text-sm text-ink-soft">
            <Link href={`/login?next=/shop/${book.id}`} className="trail-link text-oxblood">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </section>
    </div>
  );
}
