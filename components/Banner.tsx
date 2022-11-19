import React, { useEffect, useState } from "react";
import { Movie } from "../typescript";
import Image from "next/image";
import { baseUrl } from "../constansts/movie";
import { FaPlay } from "react-icons/fa";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { motion, useScroll, useTransform } from "framer-motion";
interface Props {
  netflixOriginals: Movie[];
}

const boxVariants = {
  out: {
  },
  in: {
    transition: {
      duration: 0.6,
      // The first child will appear AFTER the parrent has appeared on the screen
      delayChildren: 1.2,
      // The next sibling will appear 0.5s after the previous one
      staggerChildren: 0.5,
    },
  },
};

const iconVariants = {
  out: {
    x: '-120%',
  },
  in: {
    x: '0',
  },
};
const iconUpVariants = {
  out: {
    opacity:0,
    y: 90,
  },
  in: {
    opacity:1,
    y: 0 ,
  },
};
function Banner({ netflixOriginals }: Props) {
  const [movie, setMovie] = useState<Movie | null>();

  // const {scrollYProgress} = useScroll()
  // let y = useTransform(scrollYProgress , [0 , 1] , ['0%' , '70%'])
  const { scrollY } = useScroll();
  let y = useTransform(scrollY, [0, 500], ["0%", "40%"]);
  useEffect(() => {
    setMovie(
      netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
    );
  }, [netflixOriginals]);
  return (
    <motion.div
    variants={boxVariants} initial="out" animate="in"
      className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12"
    >
      <motion.div
        style={{ y }}
        className=" mt-[70px] absolute top-0 left-0 -z-10 h-[95vh] w-full"
      >
        <Image
          src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
          layout="fill"
          objectFit="cover"
        />
      </motion.div>
      <motion.h1
        variants={iconVariants}
        
        className="text-2xl font-bold md:text-4l lg:text-2xl"
      >
        {movie?.title || movie?.name || movie?.original_name}
      </motion.h1>
      <motion.p
        variants={iconVariants}
        className="max-w-xs text-xs md:text-lg lg:max-w-2xl text-shadow-lg lg:text-2xl"
      >
        {movie?.overview}
      </motion.p>
      <div className="flex space-x-2">
        <motion.button variants={iconUpVariants} className="bannerButton  bg-white text-black">
          <FaPlay className="h-4 w-4 text-black md:h-7 md:w-7" />
          Play
        </motion.button>
        <motion.button variants={iconUpVariants} className="bannerButton bg-gray-500/80 ">
          <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8" />
          More Info
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Banner;
