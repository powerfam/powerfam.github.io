'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center px-8 md:px-16 lg:px-24 overflow-hidden">
      {/* 세로 영상 - 모바일 프레임 스타일 */}
      <div className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 z-0">
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, delay: 0.3, type: "spring" }}
    className="relative w-[270px] h-[480px] md:w-[310px] md:h-[550px]"
  >
    {/* 3단 그림자로 입체감 */}
    <div className="absolute inset-0 rounded-[35px] overflow-hidden shadow-2xl">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/movies/main_movie_3.mov" type="video/mp4" />
        <source src="/movies/main_movie_3.mp4" type="video/mp4" />
      </video>
    </div>
    
    {/* 그림자 레이어 1 */}
    <div className="absolute -inset-1 bg-[#826644]/5 rounded-[38px] blur-sm -z-10" />
    
    {/* 그림자 레이어 2 */}
    <div className="absolute -inset-3 bg-[#D99058]/8 rounded-[42px] blur-lg -z-20" />
  </motion.div>
</div>

      {/* 좌측 텍스트 콘텐츠 */}
      <div className="relative z-10 max-w-xl">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2
          }}
          className="space-y-4 text-left"
        >
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: "easeOut"
            }}
            className="text-5xl md:text-6xl font-bold"
            style={{ color: 'var(--menu-main)' }}
          >
            Voti Web
          </motion.h1>

          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.8
            }}
            className="text-2xl md:text-3xl font-medium"
          >
            환영합니다
          </motion.p>

          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.1
            }}
            className="text-lg md:text-xl opacity-70"
          >
            이곳은 메인화면에 들어갈 메시지입니다.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}