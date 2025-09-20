// lib/auth.js
import CredentialsProvider from 'next-auth/providers/credentials';

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
          return null;
        }

        try {
          const response = await fetch(`${process.env.SERVER_API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          return {
            id: data.user.id,
            fullName: data.user.full_name,
            username: data.user.username,
            avatar: data.user.avatar,
            prodi: data.user.prodi,
            nim: data.user.nim,
            email: data.user.email,
            publicKey: data.user.public_key,
            token: data.token,
          };
        } catch (error) {
          return null;
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
