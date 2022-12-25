import { DocumentData } from 'firebase/firestore'
import { atom } from 'recoil'
import { Movie } from "../typescript";

export const modalState = atom({
  key: 'modalState',
  default: false,
})
export const volumeState = atom({
  key: 'volumeState',
  default: 0.8,
})
export const playState = atom({
  key: 'playState',
  default: 0,
})
export const movieState = atom<Movie | DocumentData | null>({
  key: 'movieState',
  default: null,
})