import { atom } from "recoil";

//tells us what track ID we've selected
export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

//if playing is true, if not, it's false.
export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});
