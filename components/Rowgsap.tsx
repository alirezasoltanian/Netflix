import { useRef, useState, useEffect } from 'react';
import { Movie } from '../typescript';
import Thumbnail from './Thumbnail';
import Skelet from './skelet';
import { motion, Variants } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { TitleText, TypingText } from './CustomTexts';
import { staggerContainer } from '../utils/motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
interface Props {
  title: string;
  movies: Movie[];
  scroller: any  ;
}
const cardVariants: Variants = {
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};
function Rowgsap({ title, movies , scroller }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    console.log(rowRef.current!.scrollLeft);
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  // console.log(movies);
  const skills = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let skillSet = gsap.utils.toArray('.skill-set');
    
    let to = gsap.to(skillSet, {
      xPercent: () => -100 * (skillSet.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: scroller.current ,
        markers: false,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 10,
        snap: 1 / (skillSet.length - 1),

        end: () => '+=' + window.innerWidth,
      },
    });

    return () => {
      to.kill();
    };
  }, []);
  return (
      <motion.div
        // variants={staggerContainer}
        // initial='hidden'
        // whileInView='show'
        // viewport={{ once: false, amount: 0.25 }}
        // className='h-40 space-y-0.5 md:space-y-2'
        className='overflow-x-hidden'
      >
        <TypingText titles={title} textStyles='' />

        <div className='group relative md:-ml-2'>
          <ChevronLeftIcon
            className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
              !isMoved && 'hidden'
            }`}
            onClick={() => handleClick('left')}
          />
          <div
            className='flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2'
            ref={rowRef}
          >
            {movies
              ? movies.map((movie: any, index) => (
                  <motion.div
                    key={index}
                    // initial={{ opacity: 0, scale: 0.5 }}
                    // whileInView={{ opacity: 1, scale: 1 }}
                    // viewport={{ once: true, amount: 0.01 }}
                    // transition={{
                    //   duration: 0.5,
                    //   // repeat: Infinity,
                    //   delay: index / 10 + 0.3,
                    //   ease: 'linear',
                    //   bounce: 0.1,
                    //   stiffness: 300 /* 0 until 500 */,
                    //   damping: 10 /* 0 until 10 */,
                    //   mass: 1 /* 0 until 10 */,
                    // }}
                    ref={skills}
                    className='skill-set'
                  >
                    <Thumbnail key={movie.id} movie={movie} />
                  </motion.div>
                ))
              : [1, 2, 3].map((n) => <Skelet key={n} />)}
          </div>
          <ChevronRightIcon
            className='absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100'
            onClick={() => handleClick('right')}
          />
        </div>
      </motion.div>
  );
}

export default Rowgsap;
