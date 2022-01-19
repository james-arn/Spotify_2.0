import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import spotifyApi from "../lib/spotify";

function useSpotify() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        signIn(); //if refresh token doesn't work (last resort) - push them to log in.
      }
      spotifyApi.setAccessToken(session.user.accessToken); //setting access token for api throughout build (initalise once and reuse)
    }
  }, [session]); //runs on mount and when session changes (log in/out)

  return spotifyApi;
}

export default useSpotify;
