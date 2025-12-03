'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 px-4 overflow-hidden">
      {/* 책 펼쳐지는 효과 - 왼쪽에서 오른쪽으로 */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          delay: 0.2
        }}
        className="space-y-4 text-center"
        style={{ transformOrigin: 'center' }}
      >
        {/* 제목 - 페이드인 + 위에서 아래로 */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            ease: "easeOut"
          }}
          className="text-6xl font-bold"
          style={{ color: 'var(--menu-main)' }}
        >
          Voti Web
        </motion.h1>

        {/* 부제 - 페이드인 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ 
            duration: 0.6, 
            delay: 1.2
          }}
          className="text-2xl"
        >
          환영합니다
        </motion.p>
      </motion.div>

      {/* 설명 박스 - 아래에서 위로 나타나기 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: 1.5
        }}
        className="max-w-2xl space-y-4 text-center"
      >
        <p className="text-lg opacity-70">
          이곳은 메인화면에 들어갈 메시지입니다.
        </p>

        <div
          className="p-6 rounded-lg border inline-block"
          style={{
            backgroundColor: 'rgba(130, 102, 68, 0.05)',
            borderColor: 'var(--menu-main)',
          }}
        >
          <p className="text-base">
            메뉴에서 원하는 페이지를 선택해주세요.
          </p>
        </div>
      </motion.div>

      {/* 버튼들 - 좌우에서 동시에 나타나기 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.8
        }}
        className="flex gap-4 pt-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/about"
            className="px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'var(--menu-main)',
              color: 'var(--menu-main-text)',
            }}
          >
            About 보기
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/test_2"
            className="px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'var(--menu-sub)',
              color: 'var(--menu-sub-text)',
            }}
          >
            글 목록 보기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}