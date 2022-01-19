//for use with recoil
import { atom } from "recoil";

export const playlistState = atom({
  key: "playlistState",
  default: null,
});

export const playlistIdState = atom({
  key: "playlistIdState", //needs to be unique. Ref in global memory.
  default: "6iNenOLfxDf94ZF9OZA8fd",
});
