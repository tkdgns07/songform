// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      id?: string;
      birthday?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    email: string;
  }

  interface Session {
    accessToken?: string;
  }

  interface User {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}