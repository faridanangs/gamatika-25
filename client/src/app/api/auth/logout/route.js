// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  response.cookies.delete('auth-token');
  return response;
}
