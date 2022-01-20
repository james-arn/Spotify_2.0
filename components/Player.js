import { ReplyIcon, SwitchHorizontalIcon } from "@heroicons/react/outline";
import {
  RewindIcon,
  PlayIcon,
  FastForwardIcon,
  PauseIcon,
} from "@heroicons/react/solid";
import { data } from "autoprefixer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify(); //helper funciton
  const { data: session } = useSession(); //get the img of user - tap into user session info.
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState); //tells us what track ID we've selected
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); //if playing is true, if not, it's false.
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      //got current playing track set as current track id.
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: ", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
        //adjust isPlaying by calling to get current playback state- spotify returns checking if song is playing.
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left  */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center  */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => spotifyApi.skipToPrevious()}
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-7 h-7" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-7 h-7" />
        )}
        <FastForwardIcon
          className="button"
          onClick={() => spotifyApi.skipToNext()}
          // spotifyApi not working
        />
        <ReplyIcon className="button" />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5"></div>
    </div>
  );
}

export default Player;
