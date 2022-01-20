import { getSession } from "next-auth/react";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

//pre-render user on server which gives us access token before it hits client so we have the key.
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
