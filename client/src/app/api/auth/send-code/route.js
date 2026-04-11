// // app/api/auth/send-code/route.js
// import { NextResponse } from 'next/server';
// import { Resend } from 'resend';
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request) {
//   try {
//     const { fullName, username, prodi, email, password } =
//       await request.json();

//     const verificationCode = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     console.log(`Verification code for ${email}: ${verificationCode}`);

//     const { data, error } = await resend.emails.send({
//       from: 'Delta Civitas <onboarding@resend.dev>',
//       to: [email],
//       subject: 'Kode Verifikasi Akun Delta Civitas Anda',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//             <h1 style="color: #333;">Halo, ${fullName}!</h1>
//             <p style="color: #666; font-size: 16px;">Terima kasih telah mendaftar. Gunakan kode ini untuk memverifikasi email Anda:</p>
//             <div style="background-color: #4f46e5; color: white; font-size: 36px; letter-spacing: 8px; padding: 15px; margin: 20px 0; border-radius: 8px; font-weight: bold;">
//               ${verificationCode}
//             </div>
//             <p style="color: #666; font-size: 14px;">Kode ini akan kedaluwarsa dalam 10 menit.</p>
//             <p style="color: #666; font-size: 14px; margin-top: 20px;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
//           </div>
//         </div>
//       `,
//     });

//     if (error) {
//       console.error('Resend API error:', error);
//       return NextResponse.json(
//         { success: false, message: 'Gagal mengirim email verifikasi.' },
//         { status: 500 }
//       );
//     }

//     const registrationData = {
//       fullName,
//       username,
//       prodi,
//       email,
//       password,
//       verificationCode,
//     };

//     const token = jwt.sign(registrationData, process.env.JWT_SECRET, {
//       expiresIn: '10m',
//     });

//     cookies().set('registration_token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 60 * 10,
//       path: '/',
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Kode verifikasi telah dikirim ke email Anda.',
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error sending verification code:', error);
//     return NextResponse.json(
//       { success: false, message: 'Gagal mengirim kode verifikasi.' },
//       { status: 500 }
//     );
//   }
// }

// app/api/auth/send-code/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // <-- Ganti Resend dengan Nodemailer
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Hapus: const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { fullName, username, prodi, email, password } = await request.json();

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Delta Civitas" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Kode Verifikasi Akun Delta Civitas Anda',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: #333;">Halo, ${fullName}!</h1>
            <p style="color: #666; font-size: 16px;">Terima kasih telah mendaftar. Gunakan kode ini untuk memverifikasi email Anda:</p>
            <div style="background-color: #4f46e5; color: white; font-size: 36px; letter-spacing: 8px; padding: 15px; margin: 20px 0; border-radius: 8px; font-weight: bold;">
              ${verificationCode}
            </div>
            <p style="color: #666; font-size: 14px;">Kode ini akan kedaluwarsa dalam 10 menit.</p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    const registrationData = {
      fullName,
      username,
      prodi,
      email,
      password,
      verificationCode,
    };

    const token = jwt.sign(registrationData, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    cookies().set('registration_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 10,
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Kode verifikasi telah dikirim ke email Anda.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim kode verifikasi.' },
      { status: 500 }
    );
  }
}
