// app/api/register/route.js

import { ethers, N } from 'ethers';
import { NextResponse } from 'next/server';
import { handleApiResponse } from '@/lib/apiHandler';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // 1. Ambil cookie token
    const tokenCookie = cookies().get('registration_token');
    if (!tokenCookie) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sesi registrasi tidak ditemukan atau kedaluwarsa.',
        },
        { status: 400 }
      );
    }

    // 2. Ambil kode yang diinput user dari body
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Kode verifikasi diperlukan.' },
        { status: 400 }
      );
    }

    // 3. Verifikasi JWT
    let registrationData;
    try {
      registrationData = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau kedaluwarsa.' },
        { status: 401 }
      );
    }

    // 4. Bandingkan kode
    if (registrationData.verificationCode !== code) {
      return NextResponse.json(
        { success: false, message: 'Kode verifikasi salah.' },
        { status: 400 }
      );
    }

    const { fullName, username, prodi, email, password } = registrationData;

    const wallet = ethers.Wallet.createRandom();

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

    cookies().delete('registration_token');

    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil!',
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
