'use client';

import { motion } from 'framer-motion';
import TextType from '@/components/TextType';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto relative min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
      {/* 텍스트 콘텐츠 - 데스크톱에서 왼쪽 */}
      <div className="relative z-10 w-full md:w-1/2 order-2 md:order-1">
        {/* 모바일: 반투명 배경 / 데스크톱: 배경 없음 */}
        <div
          className="backdrop-blur-sm md:bg-transparent md:backdrop-blur-none p-6 md:p-0 rounded-2xl"
          style={{ backgroundColor: 'var(--background-overlay)' }}
        >
          <style jsx>{`
            @media (min-width: 768px) {
              div {
                background-color: transparent !important;
              }
            }
          `}</style>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2
            }}
            className="space-y-4 text-center md:text-left"
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut"
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ color: 'var(--menu-main)' }}
            >
              <TextType
                text="Voti Web"
                typingSpeed={100}
                loop={false}
                showCursor={false}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.8
              }}
              className="text-xl md:text-2xl lg:text-3xl font-medium"
            >
              <TextType
                text="환영합니다"
                typingSpeed={100}
                initialDelay={1000}
                loop={false}
                showCursor={false}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.1
              }}
              className="text-base md:text-lg lg:text-xl opacity-70"
            >
              <TextType
                text={["이곳은 메인화면에 들어갈 메시지입니다.", "타이핑 효과로 표현됩니다.", "환영합니다!"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 세로 영상 - 데스크톱에서 오른쪽 */}
      <div className="relative w-full md:w-1/2 flex justify-center order-1 md:order-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
          className="relative w-[200px] h-[360px] md:w-[280px] md:h-[500px]"
        >
          {/* 3단 그림자로 입체감 */}
          <div className="absolute inset-0 rounded-[35px] overflow-hidden shadow-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80 md:opacity-100"
            >
              <source src="/movies/main_movie_3.mp4" type="video/mp4" />
            </video>
          </div>

          {/* 그림자 레이어 1 */}
          <div className="absolute -inset-1 bg-[#826644]/5 rounded-[38px] blur-sm -z-10" />

          {/* 그림자 레이어 2 */}
          <div className="absolute -inset-3 bg-[#D99058]/8 rounded-[42px] blur-lg -z-20" />
        </motion.div>
      </div>
    </div>
  );
}
