// app/api/auth/register/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { fullName, username, prodi, nim, email, password } =
      await request.json();

    // Call backend registration API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: fullName,
        username,
        prodi,
        nim: Number(nim),
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Registration failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { message: 'Registration successful', user: data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
