import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay credentials not found in environment variables");
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: "plan_monthly_pro",
    name: "Pro Monthly",
    amount: 99900, // ₹999 in paise
    currency: "INR",
    interval: "monthly",
    description: "Access to all 268+ premium tools",
    features: [
      "All 268+ Business Tools",
      "Unlimited Usage",
      "Priority Support",
      "API Access",
      "Custom Branding",
      "Data Export"
    ]
  },
  yearly: {
    id: "plan_yearly_pro",
    name: "Pro Yearly",
    amount: 999900, // ₹9,999 in paise (2 months free)
    currency: "INR",
    interval: "yearly",
    description: "Best value - Save ₹1,989",
    features: [
      "Everything in Monthly",
      "2 Months Free",
      "Dedicated Account Manager",
      "Custom Integrations",
      "White Label Options",
      "Training Sessions"
    ]
  }
};

export async function createRazorpayOrder(amount: number, currency = "INR") {
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  return await razorpay.orders.create(options);
}

export async function createSubscription(customerId: string, planId: string) {
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_id: customerId,
    total_count: 0, // Unlimited billing cycles
    customer_notify: 1,
    notes: {
      source: "clientforce_web"
    }
  });

  return subscription;
}

export async function createCustomer(email: string, name: string, phone?: string) {
  const customer = await razorpay.customers.create({
    name,
    email,
    contact: phone,
    notes: {
      source: "clientforce_web"
    }
  });

  return customer;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}