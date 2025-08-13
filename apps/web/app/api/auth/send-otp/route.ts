import { NextRequest, NextResponse } from "next/server";

// In production, use a proper SMS service like Twilio or MSG91
// For demo purposes, we'll just log the OTP
async function sendSMS(phone: string, otp: string) {
  console.log(`📱 SMS sent to ${phone}: Your OTP is ${otp}`);
  // In production:
  // await twilioClient.messages.create({
  //   body: `Your ClientForce OTP is: ${otp}. Valid for 10 minutes.`,
  //   to: `+91${phone}`,
  //   from: process.env.TWILIO_PHONE_NUMBER
  // });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // For demo purposes, always use OTP "123456"
    const otp = "123456";
    
    // Send OTP via SMS (simulated for demo)
    await sendSMS(phone, otp);

    return NextResponse.json({
      message: "OTP sent successfully",
      // For demo, show the OTP
      demo_otp: otp,
      note: "Use OTP: 123456 for demo login"
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}