import { NextResponse } from "next/server";

export async function POST() {
  // In a real app, you might want to invalidate the token on the server
  // For now, we'll just return a success response
  // The client will handle removing the token from localStorage
  
  return NextResponse.json({
    message: "Logged out successfully"
  });
}