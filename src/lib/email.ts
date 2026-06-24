import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "OK Shirts <orders@okshirts.com>";

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  total: number
) {
  if (!resend) {
    console.log(`[Email stub] Order confirmation to ${to}: ${orderNumber}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Order Confirmed — ${orderNumber}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D5016;">OK Shirts</h1>
        <p>Thank you for your order!</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total:</strong> ₹${total.toLocaleString("en-IN")}</p>
        <p>Payment: Cash on Delivery</p>
        <p>We will begin stitching your garments shortly. You can track your order on our website.</p>
      </div>
    `,
  });
}

export async function sendOrderStatusEmail(
  to: string,
  orderNumber: string,
  status: string
) {
  if (!resend) {
    console.log(`[Email stub] Status update to ${to}: ${orderNumber} → ${status}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Order Update — ${orderNumber}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D5016;">OK Shirts</h1>
        <p>Your order <strong>${orderNumber}</strong> status has been updated.</p>
        <p><strong>New Status:</strong> ${status}</p>
        <p>Track your order on our website for more details.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  if (!resend) {
    console.log(`[Email stub] Welcome email to ${to}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to OK Shirts",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D5016;">Welcome to OK Shirts, ${name}!</h1>
        <p>Thank you for joining us. Explore our collection of custom-stitched shirts, pants, and suits.</p>
      </div>
    `,
  });
}
