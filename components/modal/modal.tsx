import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState, movieState, volumeState } from '../../atoms/modalAtom';
import ReactPlayer from 'react-player/lazy';
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { BsFillVolumeUpFill } from 'react-icons/bs';
import { BsVolumeMuteFill } from 'react-icons/bs';
import { AiOutlineLike } from 'react-icons/ai';
import { BsFillPauseFill } from 'react-icons/bs';
import { CheckIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Element, Genre, Movie } from '../../typescript';
import MuiModal from '@mui/material/Modal';
import {
  motion,
} from "framer-motion";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import useAuth from '../../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import LineVolume from './LineVolume';

function Modal() {
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState('');
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [addedToList, setAddedToList] = useState(false);
  const { user } = useAuth();
  const [volume, setVolume] = useRecoilState(volumeState);
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);
  let [hovered, setHovered] = useState(false);
  let [panning, setPanning] = useState(false);

  const toastStyle = {
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  };

  useEffect(() => {
    if (!movie) return;

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((response) => response.json());
      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === 'Trailer'
        );
        setTrailer(data.videos?.results[index]?.key);
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
    }

    fetchMovie();
  }, [movie]);
  const handleClose = () => {
    setShowModal(false);
    setMovie(null);
    toast.dismiss();
  };

  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [db, movie?.id]);

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  );

  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      );

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          duration: 8000,
          style: toastStyle,
        }
      );
    } else {
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        {
          ...movie,
        }
      );

      toast(
        `${movie?.title || movie?.original_name} has been added to My List.`,
        {
          duration: 8000,
          style: toastStyle,
        }
      );
    }
  };

  console.log(addedToList);

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className='fixed !top-7 left-0 right-0 z-50  mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide'
    >
      <div className='mx-10 '>
        <Toaster position='bottom-center' />
        <button
          className='modalButton absolute right-12 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]'
          onClick={handleClose}
        >
          <XCircleIcon className='h-6 w-6' />
        </button>

        <motion.div
          onPanStart={() => setPanning(true)}
          onPanEnd={() => setPanning(false)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className='relative  pt-[56.25%]'
        >
          {trailer ?
          <ReactPlayer
          url={`https://www.youtube.com/watch?v=${trailer}`}
            width='100%'
            height='100%'
            style={{  position: 'absolute', top: '0', left: '0' }}
            playing={play}
            className='bg-gray-400 '
            muted={muted}
            volume={volume}
            /> 
            :
            <div className='bg-gray-600 w-[100%] h-[100%] top-0 left-0'></div>
          }
            <div>
            {hovered && (
              <div className='absolute -mt-[35%] ml-[70%]'>
                <LineVolume />
              </div>
            )}
            <div className='absolute bottom-10 flex w-full items-center justify-between px-10'>
              <div className='flex space-x-2'>
                <button
                  className='flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]'
                  onClick={() => setPlay(!play)}
                >
                  {play ? (
                    <BsFillPauseFill className='h-7 w-7 text-black' />
                  ) : (
                    <FaPlay className='h-6 w-6' />
                  )}
                </button>
                <button className='modalButton' onClick={handleList}>
                  {addedToList ? (
                    <CheckIcon className='h-7 w-7' />
                  ) : (
                    <PlusIcon className='h-7 w-7' />
                  )}
                </button>
                <button className='modalButton'>
                  <AiOutlineLike className='h-6 w-6' />
                </button>
              </div>
              <button className='modalButton' onClick={() => setMuted(!muted)}>
                {muted ? (
                  <BsVolumeMuteFill className='h-6 w-6' />
                ) : (
                  <BsFillVolumeUpFill className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </motion.div>
        <div className='flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8'>
          <div className='space-y-6 text-lg'>
            <div className='flex  items-center space-x-2 text-sm'>
              <p className='font-semibold text-green-400'>
                {movie!.vote_average * 10}% Match
              </p>
              <p className='font-light'>
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>
                HD
              </div>
            </div>
            <div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row'>
              <p className='w-5/6'>{movie?.overview}</p>
              <div className='flex flex-col space-y-3 text-sm'>
                <div>
                  <span className='text-[gray]'>Genres:</span>{' '}
                  {genres.map((genre) => genre.name).join(', ')}
                </div>

                <div>
                  <span className='text-[gray]'>Original language:</span>{' '}
                  {movie?.original_language}
                </div>

                <div>
                  <span className='text-[gray]'>Total votes:</span>{' '}
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MuiModal>
  );
}

export default Modal;
