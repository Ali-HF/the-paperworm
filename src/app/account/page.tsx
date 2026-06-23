import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrdersForUser, formatPrice } from "@/lib/db";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/account");

  const orders = await getOrdersForUser(Number(session.user.id));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p
        className="text-xs tracking-[0.22em] uppercase text-oxblood mb-2"
        style={{ fontFamily: "var(--font-stamp)" }}
      >
        Account
      </p>
      <h1
        className="text-4xl mb-1"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        {session.user.name}
      </h1>
      <p className="text-ink-soft mb-10">{session.user.email}</p>

      <h2
        className="text-xl mb-4"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        Order history
      </h2>

      {orders.length === 0 ? (
        <p className="text-ink-soft">
          No orders yet.{" "}
          <Link href="/shop" className="trail-link text-oxblood">
            Start one
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {orders.map((o) => (
            <li key={o.id} className="py-4 flex items-center justify-between">
              <div>
                <Link href={`/account/orders/${o.id}`} className="trail-link font-semibold">
                  Order #{o.id}
                </Link>
                <p className="text-sm text-ink-soft">
                  {new Date(o.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right" style={{ fontFamily: "var(--font-stamp)" }}>
                <p>{formatPrice(o.total_cents)}</p>
                <p className="text-xs uppercase text-moss">{o.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
