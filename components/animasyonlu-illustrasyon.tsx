"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from 'framer-motion'

export const AnimasyonluIllustrasyon = () => {
  const [yuklendi, setYuklendi] = useState(false)

  useEffect(() => {
    setYuklendi(true)
  }, [])

  if (!yuklendi) {
    return null
  }

  return (
    <div className="w-full max-w-[300px] h-[500px] relative mx-auto">
      <div className="absolute inset-0 rounded-lg p-0.5 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="w-full h-full bg-background rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="absolute inset-0">
            <Image
              src="https://st2.depositphotos.com/5326338/7958/i/450/depositphotos_79581596-stock-photo-angelina-jolie-at-los-angeles.jpg"
              alt="Tam boy insan modeli"
              layout="fill"
              objectFit="cover"
              priority
              loading="eager"
            />
          </div>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute inset-0 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent"
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ opacity: 0.2 }}
            />
          </motion.div>

          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.1,
              }}
            />
          ))}

          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 border-2 border-white rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

