"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const hareket = dynamic(() => import('framer-motion').then((mod) => mod.motion), {
  ssr: false,
})

export function AnimasyonluBilesen() {
  const [yuklendi, setYuklendi] = useState(false)

  useEffect(() => {
    setYuklendi(true)
  }, [])

  if (!yuklendi) {
    return null
  }

  return (
    <hareket.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Animasyonlu içerik
    </hareket.div>
  )
}

