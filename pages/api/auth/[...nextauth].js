import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    //renaming body to refreshedToken, sending both values back to spotify
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //= 1 hour as 3600 returns from spotify API
      //if refresh token exists, use it, otherwise default back to previous refresh token.
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
/* AUTHENTICATION - JWT TOKEN */
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    //3 scenarios - 1. initial sign in for 1st token. 2. THen when coming back, (persisted state) is token now still valid? Yes = use. 3. If not, refresh token. Then return
    async jwt({ token, account, user }) {
      //1. Initial sign in
      if (account && user) {
        //refresh token rotation
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, //1000 is milliseconds, hence *1000 (1 hour)
        };
      }
      //2. Return the previous token if access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }
      // 3. Access token has expired, so we need to refresh it
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return token;
    },

    /* CONNECT TO WHAT CLIENT CAN SEE - TAKE WHAT WE WANT FROM TOKEN INTO HERE */
    async session({ session, token }) {
      //session.user is the part the user can see. But token user can't see. see we need to allocate token to user, as tokenis http only (JS client can't read cookie - it's safe/secure)
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
