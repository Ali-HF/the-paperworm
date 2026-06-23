import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrdersForUser, getOrderItems, formatPrice } from "@/lib/db";
import BookCover from "@/components/BookCover";
import WormMark from "@/components/WormMark";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const orderId = Number(id);

  const order = (await getOrdersForUser(Number(session.user.id))).find((o) => o.id === orderId);
  if (!order) notFound();

  const items = await getOrderItems(orderId);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <WormMark size={36} className="mx-auto mb-4" />
        <p
          className="text-xs tracking-[0.22em] uppercase text-oxblood mb-2"
          style={{ fontFamily: "var(--font-stamp)" }}
        >
          Order confirmed
        </p>
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Thanks — it&rsquo;s tunneling its way to you.
        </h1>
        <p className="text-ink-soft mt-2">
          Order #{order.id} ·{" "}
          {new Date(order.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs uppercase text-ink-soft" style={{ fontFamily: "var(--font-stamp)" }}>Status:</span>
          <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
            order.status === "Delivered" ? "text-green-800 bg-green-100" :
            order.status === "Shipped" ? "text-amber-800 bg-amber-100" :
            order.status === "Processing" ? "text-blue-800 bg-blue-100" :
            "text-moss bg-moss/10"
          }`} style={{ fontFamily: "var(--font-stamp)" }}>
            {order.status}
          </span>
        </div>
      </div>

      <ul className="divide-y divide-ink/10 mb-8">
        {items.map((item) => (
          <li key={item.id} className="py-4 flex gap-4">
            <div className="w-12 shrink-0">
              <BookCover
                title={item.title}
                author={item.author}
                genre=""
                seed={item.cover_seed}
                className="w-full h-auto rounded-xl ring-1 ring-ink/10"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                {item.title}
              </p>
              <p className="text-sm text-ink-soft">
                {item.author} · Qty {item.quantity}
              </p>
            </div>
            <div style={{ fontFamily: "var(--font-stamp)" }}>
              {formatPrice(item.price_cents * item.quantity)}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-lg font-semibold pt-4 border-t border-ink/10 mb-10">
        <span>Total</span>
        <span style={{ fontFamily: "var(--font-stamp)" }}>{formatPrice(order.total_cents)}</span>
      </div>

      <div className="text-center">
        <Link href="/shop" className="trail-link text-oxblood">
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
