/**
 * Utility to simulate sending email confirmations
 */
export async function sendEmailNotification(to: string, subject: string, htmlContent: string): Promise<boolean> {
  console.log("\n--- SIMULATED EMAIL NOTIFICATION ---");
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Content:");
  console.log(htmlContent);
  console.log("------------------------------------\n");
  
  /* 
   * TODO: Wire in a real email service provider here in the future.
   * e.g., Resend:
   * const resend = new Resend(process.env.RESEND_API_KEY);
   * await resend.emails.send({ from: 'onboarding@resend.dev', to, subject, html: htmlContent });
   */
  return true;
}
