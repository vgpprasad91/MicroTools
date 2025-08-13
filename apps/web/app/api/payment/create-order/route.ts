import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createRazorpayOrder } from "@/lib/razorpay";
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
    const { amount, currency = "INR" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await createRazorpayOrder(amount, currency);

    // Save order in database
    await prisma.payment.create({
      data: {
        userId: decoded.userId,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: "created"
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}