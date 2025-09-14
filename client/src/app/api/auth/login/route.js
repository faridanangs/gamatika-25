// app/api/auth/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Login failed' },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();

    // Simpan token di cookie
    const response = NextResponse.json(
      { message: 'Login successful', user: data.user },
      { status: 200 }
    );

    response.cookies.set('auth-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'lax',
      maxAge: 60 * 60 * 5,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
