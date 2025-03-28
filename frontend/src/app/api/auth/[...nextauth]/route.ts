import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import prisma from '@pclient/client';

interface StudentInfo {
  id: number;
  name: string;
  grade: number;
  birthday: string;
}

const isAdmin = async (email: string): Promise<boolean> => {
  const existingRecord = await prisma.admin.findFirst({
    where: {
      email: email,
    },
  });
  return existingRecord ? true : false;
};

const year = new Date().getFullYear();
const shortYear = year % 100;

const idExtract = (email: string): string | null => {
  const regex = new RegExp(`h012s${shortYear}(\\d)(\\d{2})`);
  const match = email.match(regex);

  if (match && match[1]) {
    const firstDigit = parseInt(match[1], 10); // 첫 번째 캡처된 한 자리 숫자
    const restDigits = match[2];

    let result: string;

    if (firstDigit >= 1 && firstDigit <= 3) {
      result = `1${firstDigit}${restDigits}`;
    } else if (firstDigit >= 4 && firstDigit <= 6) {
      result = `2${firstDigit - 3}${restDigits}`;
    } else if (firstDigit >= 7 && firstDigit <= 9) {
      result = `3${firstDigit - 6}${restDigits}`;
    } else {
      return null;
    }
    return result;
  }
  return null;
};

let userInfo: StudentInfo | null = null;

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            'openid profile email https://www.googleapis.com/auth/youtube.force-ssl',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? '';

      const checkAdmin = await isAdmin(email);
      if (checkAdmin) {
        return true;
      }

      const id = idExtract(email);
      if (!id) {
        return '/error?error=email-err';
      }
      try {
        const data = { id: id };
        const response = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/data/student/get`,
          data,
          {
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
          },
        );
        userInfo = response.data.data;
      } catch (error) {}

      if (!userInfo) {
        return '/error?error=server-email';
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        if (userInfo) {
          token.name = userInfo.name;
          token.id = userInfo.id;
          token.birthday = userInfo.birthday;
          token.admin = false;
        } else {
          token.admin = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
        session.accessToken = token.accessToken as string | undefined;
        session.user.id = token.id as string | null;
        session.user.birthday = token.birthday as string | null;
        session.user.admin = token.admin as boolean;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/error?error=login',
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
