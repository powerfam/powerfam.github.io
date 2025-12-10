import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'repo',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // 내 GitHub 계정만 허용
      const githubProfile = profile as { login?: string };
      if (githubProfile?.login === process.env.GITHUB_OWNER) {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/admin',
    error: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
};
