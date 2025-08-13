import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // For testing purposes, return a dummy user
  return NextResponse.json({
    user: {
      id: "test123",
      name: "Test User",
      email: "test@example.com",
      subscriptionStatus: "active"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciJ9.test"
  });
}