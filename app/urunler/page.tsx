"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GirisModal } from "@/components/giris-modal"

export default function Urunler() {
 const [girisYapildi, setGirisYapildi] = useState(false)
 const [girisModalAcik, setGirisModalAcik] = useState(false)
 const router = useRouter()

 useEffect(() => {
   const mevcutKullanici = JSON.parse(localStorage.getItem('currentUser') || 'null')
   setGirisYapildi(!!mevcutKullanici)
   if (mevcutKullanici) {
     router.push('/urun-dene/1')
   } else {
     setGirisModalAcik(true)
   }
 }, [router])

 const handleGirisBasarili = () => {
   setGirisYapildi(true)
   setGirisModalAcik(false)
   router.push('/urun-dene/1')
 }

 if (girisYapildi) {
   return null
 }

 return (
   <GirisModal 
     isOpen={girisModalAcik} 
     onClose={() => setGirisModalAcik(false)} 
     onSuccess={handleGirisBasarili} 
   />
 )
}

