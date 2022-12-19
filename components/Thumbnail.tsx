import React, { useState } from "react";
import { Movie } from "../typescript";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { modalState, movieState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
interface Props {
  movie: Movie;
}
const boxVariants = {
  out: {
  },
  in: {
    transition: {
      duration: 0.001,
      // The first child will appear AFTER the parrent has appeared on the screen
      delayChildren: 1.2,
      // The next sibling will appear 0.5s after the previous one
      staggerChildren: 2.5,
    },
  },
  exit: {
  },
};
const boxUpVariants = {
  
  out: {
  },
  in: {
    opacity:[0,1],
    width: ['100%','100%'] , height: ['0%','100%'],
    transition: {
      duration: 0.4,
    },
    
  },
  exit: {
    opacity:[1,0],
    width: ['100%','100%'] , height: ['100%','0%'],
    transition: {
      delay: 0.6,
    },
  },
  // transition: {
  //   duration: 0.06,
    
  // },
};
const boxDownVariants = {
  out: {
  },
  in: {
    opacity:[0,1],
    y: ['90px','0px'],
    transition: {
      delay: 0.1,
      duration:0.6,
    },
  },
  
  exit: {
    opacity:[1,0],

    y: ['0px','90px']
  }
};
function Thumbnail({ movie }: Props) {
  const [focused, setFocused] = useState(false);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState)
  const [showModal, setShowModal] = useRecoilState(modalState)
  return (
    <motion.div
      className={` relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] `}
      onFocus={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onMouseEnter={() => setFocused(true)}
      variants={boxVariants}
      animate='in'
      initial='out'
      onClick={() => {
        setCurrentMovie(movie)
        setShowModal(true)
      }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        className="object-cover   rounded-sm md:rounded"
        layout="fill"
      />
      <AnimatePresence>

      {focused ? (
        <motion.div
        className="absolute bg-red-500/50 "
        variants={boxUpVariants}
        exit='exit'
      >
        <motion.h3 variants={boxDownVariants}  className="flex font-bold text-black items-center mt-10 justify-center">
        {movie?.title || movie?.name || movie?.original_name}
        </motion.h3>
      </motion.div> 
      ) : null}
      </AnimatePresence>

    </motion.div>
  );
}

export default Thumbnail;
