import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// For demo purposes, we'll use mock registration
// In production, use Prisma with a real database

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, name, otp } = body;

    // Validate input
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { message: "Either email or phone is required" },
        { status: 400 }
      );
    }

    // For phone authentication, verify OTP
    if (phone && otp) {
      if (otp !== "123456") {
        return NextResponse.json(
          { message: "Invalid OTP. Use 123456 for demo" },
          { status: 400 }
        );
      }
    }

    // Create demo user
    const user = {
      id: "user_" + Date.now(),
      name,
      email: email || null,
      phone: phone || null,
      isEmailVerified: false,
      isPhoneVerified: !!phone,
      subscriptionStatus: "inactive",
      createdAt: new Date()
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        phone: user.phone,
        name: user.name
      },
      process.env.JWT_SECRET || "demo-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      user,
      token,
      message: "Account created successfully"
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}