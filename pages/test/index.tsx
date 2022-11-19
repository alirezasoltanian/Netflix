import { useRef, useState } from "react";
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
} from "framer-motion";
function index() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 3000 , 0 ], ["0px", '3000px',  '-200px']);
  const y1 = useTransform(scrollY, [0, 1000], ["0px", '-200px']);
  const y2 = useTransform(scrollY, [0, 1000], ["0px", '-200px']);
  const y3 = useTransform(scrollY, [0, 1000], ["0px", '-200px']);

  return (
    <div className="flex justify-around mt-32">
      <motion.div style={{y}} className="w-96 h-96 bg-black"></motion.div>
      <motion.div className="space-y-12">
        <motion.div style={{y:y1}} className="w-96 h-96 bg-purple-900"></motion.div>
        <motion.div style={{y:y2}} className="w-96 h-96 bg-gray-600"></motion.div>
        <motion.div style={{y:y3}} className="w-96 h-96 bg-red-500"></motion.div>
        <div  className="w-96 h-96 bg-red-500"></div>
        <div  className="w-96 h-96 bg-red-500"></div>
        <div  className="w-96 h-96 bg-red-500"></div>
      </motion.div>
    </div>
  )
}

export default index