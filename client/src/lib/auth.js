// lib/auth.js
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleApiResponse } from './apiHandler';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_API_URL}/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const result = await handleApiResponse(response);

          if (!result.success) {
            const error = {
              message: result.message,
              fieldErrors: result.errors || [],
              success: result.success,
            };
            throw new Error(JSON.stringify(error));
          }

          return {
            id: result.data.user.id,
            fullName: result.data.user.full_name,
            username: result.data.user.username,
            avatar: result.data.user.avatar,
            prodi: result.data.user.prodi,
            nim: result.data.user.nim,
            email: result.data.user.email,
            publicKey: result.data.user.public_key,
            token: result.data.token,
          };
        } catch (error) {
          // Jika error berasal dari fetch (network error), lempar error asli
          if (error instanceof TypeError) {
            throw new Error('Terjadi kesalahan saat menghubungi server');
          }
          // Jika error sudah dalam format JSON, lempar kembali
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 5,
    updateAge: 0,
  },
  jwt: {
    maxAge: 60 * 60 * 5,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.fullName = user.fullName;
        token.username = user.username;
        token.avatar = user.avatar;
        token.prodi = user.prodi;
        token.nim = user.nim;
        token.email = user.email;
        token.publicKey = user.publicKey;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.fullName = token.fullName;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
        session.user.prodi = token.prodi;
        session.user.nim = token.nim;
        session.user.email = token.email;
        session.user.publicKey = token.publicKey;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
