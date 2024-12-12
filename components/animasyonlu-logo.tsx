"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export const AnimasyonluLogo = () => {
  const { theme } = useTheme()

  return (
    <motion.div
      className="relative w-32 h-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.svg
        viewBox="0 0 128 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.text
          x="5"
          y="22"
          fontSize="16"
          fontWeight="bold"
          fill="currentColor"
          className="text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Sanal Kıyafet
        </motion.text>
      </motion.svg>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-foreground"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

