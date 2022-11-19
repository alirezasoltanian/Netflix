import { useEffect, useRef, useState } from "react";
import { Movie } from "../typescript";
import Thumbnail from "./Thumbnail";
import Skelet from "./skelet";
import { wrap } from "@motionone/utils";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useViewportScroll,
} from "framer-motion";
let scrollThreshold = [0, 1000];

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
interface Props {
  title: string;
  movies: Movie[];
}

function Row({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

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
  let { scrollY } = useScroll();
  let scrollYOnDirectionChange = useRef(scrollY.get());
  let lastPixelsScrolled = useRef();
  let lastScrollDirection = useRef();
  let pixelsScrolled = useMotionValue(0);
  let x = useTransform(pixelsScrolled, scrollThreshold, [1020, -2000]);
  let logoHeight = useTransform(pixelsScrolled, scrollThreshold, [33, 30]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest < 0) return;

      let isScrollingDown = scrollY.getPrevious() - latest < 0;
      let scrollDirection = isScrollingDown ? "down" : "up";
      let currentPixelsScrolled = pixelsScrolled.get();
      let newPixelsScrolled;

      if (lastScrollDirection.current !== scrollDirection) {
        lastPixelsScrolled.current = currentPixelsScrolled;
        scrollYOnDirectionChange.current = latest;
      }

      if (isScrollingDown) {
        newPixelsScrolled = Math.min(
          lastPixelsScrolled.current +
            (latest - scrollYOnDirectionChange.current),
          scrollThreshold[1]
        );
      } else {
        newPixelsScrolled = Math.max(
          lastPixelsScrolled.current -
            (scrollYOnDirectionChange.current - latest),
          scrollThreshold[0]
        );
      }

      pixelsScrolled.set(newPixelsScrolled);
      lastScrollDirection.current = scrollDirection;
    });
  }, [pixelsScrolled, scrollY]);
  // justMove

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
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
                <motion.div
                  key={index}
                  // initial={{ opacity: 0 }}
                  // whileInView={{ opacity: 1 }}
                  // viewport={{ once: false, amount: 0.5 }}
                  // transition={{ delay: index + 1 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{
                    duration: .5,
                    // repeat: Infinity,
                    delay: index/100 + 0.003,
                    ease: "linear",
                    bounce: 0.1,
                    stiffness: 300, /* 0 until 500 */
                    damping:10, /* 0 until 10 */
                    mass:1, /* 0 until 10 */
                    type: 'spring'
                  }}
                  style={{ x }}
                >
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
    </div>
  );
}

export default Row;
