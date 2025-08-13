import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createCustomer, createSubscription, SUBSCRIPTION_PLANS } from "@/lib/razorpay";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const body = await request.json();
    const { planType } = body; // "monthly" or "yearly"

    if (!planType || !SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { message: "Invalid plan type" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Create Razorpay customer if not exists
    let customerId = user.razorpayCustomerId;
    if (!customerId) {
      const customer = await createCustomer(
        user.email || "",
        user.name,
        user.phone || undefined
      );
      customerId = customer.id;

      // Update user with customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { razorpayCustomerId: customerId }
      });
    }

    // Create subscription
    const plan = SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS];
    const subscription = await createSubscription(customerId, plan.id);

    // Save subscription in database
    const dbSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        razorpaySubscriptionId: subscription.id,
        planId: plan.id,
        planName: plan.name,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_start * 1000),
        currentPeriodEnd: new Date(subscription.current_end * 1000)
      }
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      plan: plan,
      subscription: dbSubscription
    });

  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { message: "Failed to create subscription" },
      { status: 500 }
    );
  }
}