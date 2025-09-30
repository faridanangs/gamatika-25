import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import { handleApiResponse } from '@/lib/apiHandler';

export async function POST(request) {
  try {
    const wallet = ethers.Wallet.createRandom();
    const { fullName, username, prodi, nim, email, password } =
      await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          username,
          prodi,
          nim: nim,
          email,
          password,
          wallet_address: wallet.address,
          private_key: wallet.privateKey,
        }),
      }
    );

    const result = await handleApiResponse(response);

    if (!result.success) {
      return NextResponse.json(result, { status: result.status });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
