import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = Number(id);

  if (Number.isNaN(orderId)) {
    return new NextResponse("Invalid order ID", { status: 400 });
  }

  // 1. Update status to Confirmed
  await updateOrderStatus(orderId, "Confirmed");

  // 2. Grant guest order access cookie (just in case they are on a different device)
  const cookieStore = await cookies();
  cookieStore.set(`guest_order_access_${orderId}`, "true", { maxAge: 86400 * 7, path: "/" });

  // 3. Construct base URL dynamically from request url
  const requestUrl = new URL(request.url);
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  return NextResponse.redirect(`${baseUrl}/account/orders/${orderId}`);
}
