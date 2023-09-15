import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { wrap } from "@motionone/utils";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform
} from "framer-motion";
import { useRef, useState } from "react";
import { Movie } from "../typescript";
import Thumbnail from "./Thumbnail";
import Skelet from "./skelet";
interface Props {
  title: string;
  movies: Movie[];
}

import { staggerContainer } from "../utils/motion";
import { TypingText } from "./CustomTexts";

function Row({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [deltas, setDeltas] = useState(20);

  const handleClick = (direction: string) => {
    console.log(rowRef.current!.scrollLeft);
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };
  // console.log(movies);
  // justMove
  const baseVelocity = -1000;
  const baseX = useMotionValue(0);

  const x = useTransform(baseX, (v) => `${wrap(1, -1500, v)}%`);
  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (deltas / 20000);

    baseX.set(baseX.get() + moveBy);
  });
  // justMove

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      onMouseEnter={() => setDeltas(0)}
      onFocus={() => setDeltas(0)}
      onMouseLeave={() => setDeltas(20)}
      viewport={{ once: true, amount: 0.25 }}
      className="h-40 space-y-0.5 md:space-y-2"
    >
      <TypingText titles={title} textStyles="" />
      <div className="group relative md:-ml-2">
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && "hidden"
          }`}
          onClick={() => handleClick("left")}
        />
        <div
          className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2"
          ref={rowRef}
        >
          {movies
            ? movies.map((movie: any, index) => (
                <motion.div className="z-20" key={index} style={{ x }}>
                  <Thumbnail key={movie.id} movie={movie} />
                </motion.div>
              ))
            : [1, 2, 3].map((n) => <Skelet key={n} />)}
        </div>
        <ChevronRightIcon
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick("right")}
        />
      </div>
    </motion.div>
  );
}

export default Row;
