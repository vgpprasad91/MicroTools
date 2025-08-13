import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPaymentSignature } from "@/lib/razorpay";
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Missing payment details" },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update payment in database
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid"
      }
    });

    // If this is a subscription payment, update user's subscription status
    if (payment.subscriptionId) {
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          subscriptionStatus: "active",
          subscriptionId: payment.subscriptionId
        }
      });
    }

    return NextResponse.json({
      message: "Payment verified successfully",
      payment
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Payment verification failed" },
      { status: 500 }
    );
  }
}