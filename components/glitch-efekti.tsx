"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const GlitchEfekti: React.FC = () => {
  const [glitchler, setGlitchler] = useState<JSX.Element[]>([])

  useEffect(() => {
    const glitchOlustur = () => {
      const glitch = (
        <motion.div
          key={Math.random()}
          className="absolute bg-primary/20 mix-blend-screen"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 3 + 1}px`,
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scaleX: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.3,
            times: [0, 0.1, 0.9, 1],
            repeat: 0,
          }}
          onAnimationComplete={() => {
            setGlitchler((prev) => prev.filter((g) => g.key !== glitch.key))
          }}
        />
      )
      setGlitchler((prev) => [...prev, glitch])
    }

    const aralik = setInterval(glitchOlustur, 300)
    return () => clearInterval(aralik)
  }, [])

  return (
    <>
      {glitchler}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 mix-blend-overlay" />
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </>
  )
}

