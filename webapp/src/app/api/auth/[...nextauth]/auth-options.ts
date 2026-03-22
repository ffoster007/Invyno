import GithubProvider from "next-auth/providers/github";

const googleId = process.env.GOOGLE_ID;
const googleSecret = process.env.GOOGLE_SECRET;

export const authOptions = {
  providers: [
    ...(googleId && googleSecret
      ? [
          GithubProvider({
            clientId: googleId,
            clientSecret: googleSecret,
          }),
        ]
      : []),
  ],
};
