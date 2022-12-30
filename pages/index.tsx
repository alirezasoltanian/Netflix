import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { lazy, Suspense, useRef } from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Row from '../components/Row';
import RowX from '../components/RowX';
import RowXY from '../components/RowXY';
// import RowSX from "../components/RowSX";
const RowSX = lazy(() => import('../components/RowSX'));

import { motion } from 'framer-motion';
import Modal from '../components/modal/modal';
import { Movie } from '../typescript';
import requests from '../utils/requests';
import { Footer } from '../components/footer';

import useAuth from '../hooks/useAuth';
import { modalState } from '../atoms/modalAtom';
import { useRecoilState } from 'recoil';
import Loading from '../components/Loading';

import { useInView } from 'react-intersection-observer';
import Rowgsap from '../components/Rowgsap';

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
}
const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}: Props) => {
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

  const { user, loading } = useAuth();

  const [showModal, setShowModal] = useRecoilState(modalState);
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div className='relative h-screen bg-gradient-to-b lg:h-[140vh]'>
      <Header />
      <main className='relative pl-4  pb-24 lg:space-y-24 lg:pl-16'>
        {/*Banner*/}
        <Banner netflixOriginals={netflixOriginals} />
        <section className='space-y-24' ref={ref}>
          <RowX title='Trending Now' movies={trendingNow} />
          <RowXY title='Trending Now' movies={trendingNow} />
          <div ref={scroller} className='space-y-24'>
          <Row title='Top Rated' movies={topRated} />
          <Rowgsap scroller={scroller as React.RefObject<HTMLDivElement>} title='Action Thrillers' movies={actionMovies} />
          {/* My List */}
          <Row title='Comedies' movies={comedyMovies} />
          </div>
          {inView && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <Suspense fallback={<Loading />}>
                <RowSX title='Scary Movies' movies={horrorMovies} />
              </Suspense>
            </motion.div>
          )}
          <Row title='Romance Movies' movies={romanceMovies} />
          <Row title='Documentaries' movies={documentaries} />
        </section>
        <Footer />
      </main>
      {showModal && <Modal />}
    </div>
  );
};

export default Home;
export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);
  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  };
};
