import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
//recoil imports
import { useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession(); //get the img of user - tap into user session info.
  const spotifyApi = useSpotify(); //helper funciton
  const [color, setColor] = useState(null);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState); //recoil for global state management
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop()); //uses shuffle from lodash to shuffle the array of colors and pop a value off - randomise gradient colors
  }, [playlistId]); //on load and on playlist change

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("something went wrong", err));
  }, [spotifyApi, playlistId]); //use playlist id to refetch info.

  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}
      >
        {/* <img src="" alt="" /> */}
        <h1>hello</h1>
      </section>
    </div>
  );
}

export default Center;
