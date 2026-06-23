import { NextResponse } from "next/server";
import { sql, updateOrderStatus } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let from = "";
    let body = "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      from = (formData.get("From") as string) || "";
      body = (formData.get("Body") as string) || "";
    } else {
      // Fallback to JSON if any tester sends JSON
      const json = await request.json();
      from = json.From || json.from || "";
      body = json.Body || json.body || "";
    }

    console.log(`Received WhatsApp Webhook: From=${from}, Body="${body}"`);

    if (!from || !body) {
      return new NextResponse(
        `<Response><Message>Error: Missing From or Body parameter.</Message></Response>`,
        { status: 400, headers: { "Content-Type": "application/xml" } }
      );
    }

    // Clean incoming phone number to last 10 digits
    const incomingDigits = from.replace(/\D/g, "");
    const incomingLast10 = incomingDigits.slice(-10);

    if (incomingLast10.length < 10) {
      return new NextResponse(
        `<Response><Message>Error: Invalid sender phone number format.</Message></Response>`,
        { status: 400, headers: { "Content-Type": "application/xml" } }
      );
    }

    // Find pending orders to match phone number
    const pendingOrders = await sql`
      SELECT id, shipping_json 
      FROM orders 
      WHERE status = 'Pending'
      ORDER BY id DESC
    `;

    let matchedOrder = null;

    for (const order of pendingOrders) {
      if (order.shipping_json) {
        try {
          const shipping = JSON.parse(order.shipping_json);
          const orderPhone = shipping.phone || "";
          const orderPhoneDigits = orderPhone.replace(/\D/g, "");
          const orderPhoneLast10 = orderPhoneDigits.slice(-10);

          if (orderPhoneLast10 === incomingLast10) {
            matchedOrder = order;
            break;
          }
        } catch {
          // Ignore shipping JSON parse errors
        }
      }
    }

    let xmlResponse = "";

    if (matchedOrder) {
      const text = body.toLowerCase().trim();
      const isConfirm =
        text.includes("confirm") ||
        text.includes("cinbfirm") ||
        text.includes("cionfrm") ||
        text.includes("comfirm") ||
        text.includes("confrm") ||
        text === "yes" ||
        text === "ok";

      if (isConfirm) {
        // Update order status to Confirmed
        await updateOrderStatus(matchedOrder.id, "Confirmed");
        xmlResponse = `
          <Response>
            <Message>Thank you! Your order #${matchedOrder.id} has been Confirmed and is now being processed for delivery. We will notify you when it is dispatched!</Message>
          </Response>
        `;
      } else {
        xmlResponse = `
          <Response>
            <Message>We found your pending order #${matchedOrder.id}. Please reply with "confirm" to confirm your order.</Message>
          </Response>
        `;
      }
    } else {
      xmlResponse = `
        <Response>
          <Message>Hi! We couldn't find any pending orders associated with this phone number. For assistance, contact support@paperworm.shop.</Message>
        </Response>
      `;
    }

    return new NextResponse(xmlResponse.trim(), {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new NextResponse(
      `<Response><Message>Server Error: Failed to process message.</Message></Response>`,
      { status: 500, headers: { "Content-Type": "application/xml" } }
    );
  }
}
