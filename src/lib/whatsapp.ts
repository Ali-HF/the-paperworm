/**
 * Utility to send WhatsApp messages to customers via Twilio WhatsApp API
 */
export async function sendWhatsappNotification(to: string, messageBody: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER || "+14155238886"; // Default Twilio sandbox number

  if (!accountSid || !authToken) {
    console.warn("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is not configured. WhatsApp send skipped.");
    console.log(`[MOCK WHATSAPP SEND] To: ${to}, Message: "${messageBody}"`);
    return false;
  }

  // Ensure 'to' is formatted correctly for WhatsApp (needs whatsapp:prefix and international format)
  // Let's parse/clean the phone number.
  // Pakistani numbers are often entered as 03xxxxxxxxx. Let's make sure it has +92 prefix if it's local.
  let formattedTo = to.trim();
  if (formattedTo.startsWith("0")) {
    formattedTo = "+92" + formattedTo.slice(1);
  }
  if (!formattedTo.startsWith("+")) {
    formattedTo = "+" + formattedTo;
  }

  const recipient = `whatsapp:${formattedTo}`;
  const sender = `whatsapp:${from}`;

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const params = new URLSearchParams();
    params.append("To", recipient);
    params.append("From", sender);
    params.append("Body", messageBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
      body: params.toString(),
    });

    const resJson = await response.json();
    if (!response.ok) {
      console.error("Twilio WhatsApp API error:", resJson);
      return false;
    }

    console.log(`WhatsApp notification successfully sent to ${formattedTo}. Twilio Sid: ${resJson.sid}`);
    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message via Twilio:", error);
    return false;
  }
}
