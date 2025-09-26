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
          throw new Error(
            JSON.stringify({
              message: 'Email dan password harus diisi',
              fieldErrors: [],
              success: false,
            })
          );
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_API_URL}login`,
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
            throw new Error(
              JSON.stringify({
                message: result.message,
                fieldErrors: result.errors || [],
                success: result.success,
              })
            );
          }

          return {
            id: result.data.user.id,
            fullName: result.data.user.full_name,
            username: result.data.user.username,
            avatar: result.data.user.avatar,
            prodi: result.data.user.prodi,
            nim: result.data.user.nim,
            email: result.data.user.email,
            walletAddress: result.data.user.wallet_address,
            token: result.data.token,
          };
        } catch (error) {
          let errorToReturn;

          if (error instanceof TypeError) {
            errorToReturn = JSON.stringify({
              message:
                'Unable to connect to the server. Please check your connection.',
              fieldErrors: [],
              success: false,
            });
          } else if (error.message) {
            errorToReturn = error.message;
          } else {
            errorToReturn = JSON.stringify({
              message: 'An unexpected error occurred',
              fieldErrors: [],
              success: false,
            });
          }

          throw new Error(errorToReturn);
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
        token.walletAddress = user.walletAddress;
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
        session.user.walletAddress = token.walletAddress;
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
