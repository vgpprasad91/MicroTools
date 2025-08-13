import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWebhookSignature } from "@/lib/razorpay";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-razorpay-signature");
    const body = await request.text();

    if (!signature) {
      return NextResponse.json(
        { message: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    console.log(`Webhook received: ${eventType}`);

    switch (eventType) {
      case "subscription.activated":
        await handleSubscriptionActivated(payload.subscription);
        break;

      case "subscription.charged":
        await handleSubscriptionCharged(payload.payment, payload.subscription);
        break;

      case "subscription.completed":
      case "subscription.cancelled":
        await handleSubscriptionEnded(payload.subscription);
        break;

      case "subscription.pending":
        await handleSubscriptionPending(payload.subscription);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload.payment);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { razorpaySubscriptionId: subscription.id }
  });

  if (!dbSubscription) return;

  // Update subscription status
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "active",
      currentPeriodStart: new Date(subscription.current_start * 1000),
      currentPeriodEnd: new Date(subscription.current_end * 1000)
    }
  });

  // Update user subscription status
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: {
      subscriptionStatus: "active",
      subscriptionId: dbSubscription.id,
      subscriptionEndDate: new Date(subscription.current_end * 1000)
    }
  });
}

async function handleSubscriptionCharged(payment: any, subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { razorpaySubscriptionId: subscription.id }
  });

  if (!dbSubscription) return;

  // Create payment record
  await prisma.payment.create({
    data: {
      userId: dbSubscription.userId,
      subscriptionId: dbSubscription.id,
      razorpayOrderId: payment.order_id || `order_${payment.id}`,
      razorpayPaymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: "paid",
      method: payment.method
    }
  });

  // Update subscription period
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      currentPeriodStart: new Date(subscription.current_start * 1000),
      currentPeriodEnd: new Date(subscription.current_end * 1000)
    }
  });
}

async function handleSubscriptionEnded(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { razorpaySubscriptionId: subscription.id }
  });

  if (!dbSubscription) return;

  // Update subscription status
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status,
      cancelledAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null
    }
  });

  // Update user subscription status
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: {
      subscriptionStatus: "inactive"
    }
  });
}

async function handleSubscriptionPending(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { razorpaySubscriptionId: subscription.id }
  });

  if (!dbSubscription) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: "pending" }
  });
}

async function handlePaymentFailed(payment: any) {
  if (!payment.notes?.subscription_id) return;

  const subscription = await prisma.subscription.findUnique({
    where: { razorpaySubscriptionId: payment.notes.subscription_id }
  });

  if (!subscription) return;

  // Create failed payment record
  await prisma.payment.create({
    data: {
      userId: subscription.userId,
      subscriptionId: subscription.id,
      razorpayOrderId: payment.order_id || `order_${payment.id}`,
      razorpayPaymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: "failed",
      method: payment.method
    }
  });

  // You might want to send an email notification here
}