import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// For demo purposes, we'll use a mock authentication
// In production, use the Prisma client with a real database

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, otp } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { message: "Either email or phone is required" },
        { status: 400 }
      );
    }

    // DEMO MODE: Accept any login for testing
    // In production, implement proper authentication with database
    
    if (email && password) {
      // For demo, accept any email/password
      if (password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
    } else if (phone && otp) {
      // For demo, accept OTP "123456"
      if (otp !== "123456") {
        return NextResponse.json(
          { message: "Invalid OTP. Use 123456 for demo" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Invalid login method" },
        { status: 400 }
      );
    }

    // Create demo user
    const demoUser = {
      id: "demo_user_" + Date.now(),
      email: email || null,
      phone: phone || null,
      name: email ? email.split('@')[0] : "User",
      subscriptionStatus: "active",
      isEmailVerified: !!email,
      isPhoneVerified: !!phone
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: demoUser.id, 
        email: demoUser.email, 
        phone: demoUser.phone,
        name: demoUser.name 
      },
      process.env.JWT_SECRET || "demo-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      user: demoUser,
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}