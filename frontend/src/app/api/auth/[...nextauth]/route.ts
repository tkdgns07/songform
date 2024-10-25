import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

interface StudentInfo {
  id: string;
  name: string;
  grade: number;
  birthday: string;
}

const idExtract = (email: string): string | null => {
  const regex = /h012s24(\d)(\d{2})/;
  const match = email.match(regex);

  if (match && match[1]) {
    const firstDigit = parseInt(match[1], 10);  // 첫 번째 캡처된 한 자리 숫자
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
  }else if (email === "jtfmkshs@gmail.com"){
    return "admin"
  }
  return null
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

      const id = idExtract(email);
      if(!id){return '/error&error=email-err'}
      if(id === "admin"){return true}
      try {
        const data = { id: id };
        const response = await axios.post(
          'http://127.0.0.1:8000/api/student-values/get-student/',
          data
        );
        userInfo = response.data;
      } catch (error) {
        console.error('Error fetching student data', error);
      }

      if (!userInfo) {
        return '/error&error=server-email';
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
          token.admin = false
        }else{
          token.admin = true
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
        session.user.admin = token.admin as boolean
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
