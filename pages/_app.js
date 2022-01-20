import "../styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <div>
      <Head>
        <title>Spotify 2.0</title>
        <meta
          name="description"
          content="Clone of Spotify for education purposes."
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon.svg"
        />
      </Head>
      <SessionProvider session={session}>
        <RecoilRoot>
          <Component {...pageProps} />;
        </RecoilRoot>
      </SessionProvider>
    </div>
  );
}

export default MyApp;
