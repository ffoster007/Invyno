import GithubProvider from "next-auth/providers/github";

const githubId = process.env.GOOGLE_ID;
const githubSecret = process.env.GOOGLE_SECRET;

export const authOptions = {
  providers: [
    ...(githubId && githubSecret
      ? [
          GithubProvider({
            clientId: githubId,
            clientSecret: githubSecret,
          }),
        ]
      : []),
  ],
};
