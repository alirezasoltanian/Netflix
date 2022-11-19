import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { BellIcon } from "@heroicons/react/20/solid";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from "framer-motion";
const menus = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];
let scrollThreshold = [0, 50];

function MyApp() {
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 0) {
  //       setIsScrolled(true)
  //     } else {
  //       setIsScrolled(false)
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll)

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])
  const { scrollYProgress } = useViewportScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState("Home");

  let { scrollY } = useViewportScroll();
  let scrollYOnDirectionChange = useRef(scrollY.get());
  let lastPixelsScrolled = useRef();
  let lastScrollDirection = useRef();
  let pixelsScrolled = useMotionValue(0);
  let height = useTransform(pixelsScrolled, scrollThreshold, [70, 60]);
  let logoHeight = useTransform(pixelsScrolled, scrollThreshold, [33, 30]);
  let backgroundOpacity = useTransform(
    pixelsScrolled,
    scrollThreshold,
    [1, 0.4]
  );
  let backgroundColorTemplate = useMotionTemplate`rgb(239 68 68  / ${backgroundOpacity})`;

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

  return (
    <motion.header  onMouseLeave={() => setFocused(null)}
      style={{ height, backgroundColor: backgroundColorTemplate }}
      className={` backdrop-blur bg-black sm:bg-transparent md:bg-red-500`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          className="object-contain cursor-pointer text-shadow-lg"
        />
        <ul className="hidden space-x-4 md:flex">
          {/* <li className="headerLink">Home</li>
          <li className="headerLink">TV Shows</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">New & Popular</li>
          <li className="headerLink">My List</li> */}
          {menus.map((item,index) => (
            <motion.li
              key={item}
              className="headerLink"
              style={{ position: "relative" }}
              onClick={() => setSelected(item)}
              onKeyDown={(event: { key: string }) =>
                event.key === "Enter" ? setSelected(item) : null
              }
              onFocus={() => setFocused(item)}
              onMouseEnter={() => setFocused(item)}
              tabIndex={0}
            >
              {item}
              {focused === item ? (
                <motion.div
                  transition={{
                    layout: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                  style={{
                    position: "absolute",
                    bottom: "-10%",
                    right: "-10%",
                    width: "120%",
                    height: "120%",
                    opacity: "0.5",
                    background: "rgb(0,0,0,0.5)",
                    borderRadius: "5px",
                    zIndex: 0,
                  }}
                  layoutId="highlight"
                />
              ) : null}
              {selected === item ? (
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    left: "0px",
                    right: 0,
                    height: "5px",
                    background: "#5686F5",
                    borderRadius: "8px",
                    zIndex: 0,
                  }}
                  layoutId="underline"
                />
              ) : null}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
        {/* <SearchIcon className='hidden w-6 h-6 sm sm:inline' /> */}
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className="w-6 h-6" />
        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="rounded cursor-pointer"
          />
        </Link>
      </div>
    </motion.header>
  );
}

export default MyApp;
