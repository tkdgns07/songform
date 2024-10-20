import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/youtube.force-ssl",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? "";

      // 이메일이 h012s24xxx@gw1.kr 형식인지 확인
      const regex = /^h012s24\d{3}@gw1\.kr$/;
      if (!regex.test(email)) {
        // 이메일 형식이 맞지 않으면 오류 페이지로 리다이렉트
        return '/error';
      }
      return true;
    },
    async jwt({ token, account }) {
      // 로그인 시 사용자 정보 저장 및 액세스 토큰 추가
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 이름과 프로필 사진, 액세스 토큰 추가
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
        session.accessToken = token.accessToken as string | undefined;  // 액세스 토큰 추가
      }
      return session;
    },
    async redirect({ baseUrl }) {
      // 로그인 후 홈페이지로 리다이렉트
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin', // 로그인 페이지 설정
    error: '/error', // 오류 페이지 설정
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
