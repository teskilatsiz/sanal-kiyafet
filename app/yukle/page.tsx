"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBildirim } from "@/components/ui/bildirim"
import { motion } from "framer-motion"
import { GirisModal } from "@/components/giris-modal"
import { KayitModal } from "@/components/kayit-modal"
import { Camera, Sun, Aperture } from 'lucide-react'
import { KimlikKorumasi } from "@/components/kimlik-korumasi"

export default function Yukle() {
 const [secilenDosya, setSecilenDosya] = useState<File | null>(null)
 const [onizleme, setOnizleme] = useState<string | null>(null)
 const [girisYapildi, setGirisYapildi] = useState(false)
 const [girisModalAcik, setGirisModalAcik] = useState(false)
 const [kayitModalAcik, setKayitModalAcik] = useState(false)
 const [yukleniyor, setYukleniyor] = useState(false)
 const router = useRouter()
 const { bildirim } = useBildirim()
 

 useEffect(() => {
   const kaydedilenResim = localStorage.getItem("userImage")
   if (kaydedilenResim) {
     setOnizleme(kaydedilenResim)
   }
   const mevcutKullanici = JSON.parse(localStorage.getItem('currentUser') || 'null')
   setGirisYapildi(!!mevcutKullanici)
   if (!mevcutKullanici) {
     setGirisModalAcik(true)
   }
 }, [])

 const dosyaDegistiginde = (event: React.ChangeEvent<HTMLInputElement>) => {
   if (!girisYapildi) {
     setGirisModalAcik(true)
     return
   }

   try {
     const dosya = event.target.files?.[0]
     if (dosya) {
       if (dosya.size > 5 * 1024 * 1024) { // 5MB limit
         throw new Error("Dosya boyutu 5MB'dan kucuk olmalidir.")
       }
       setSecilenDosya(dosya)
       const okuyucu = new FileReader()
       okuyucu.onloadend = () => {
         const sonuc = okuyucu.result as string
         setOnizleme(sonuc)
         localStorage.setItem("userImage", sonuc)
       }
       okuyucu.onerror = () => {
         throw new Error("Dosya okunamadi. Lutfen tekrar deneyin.")
       }
       okuyucu.readAsDataURL(dosya)
     }
   } catch (hata) {
     bildirim({
       title: "Hata",
       description: hata instanceof Error ? hata.message : "Dosya yuklenirken bir hata olustu.",
       variant: "destructive",
     })
   }
 }

 const yukle = async () => {
   if (!girisYapildi) {
     setGirisModalAcik(true)
     return
   }

   if (!onizleme) {
     bildirim({
       title: "Hata",
       description: "Lutfen bir fotograf secin.",
       variant: "destructive",
     })
     return
   }

   try {
     setYukleniyor(true)
     await new Promise(resolve => setTimeout(resolve, 2000))
     router.push("/urun-dene/user")
   } catch (hata) {
     bildirim({
       title: "Yukleme Hatasi",
       description: "Fotograf yuklenirken bir hata olustu. Lutfen tekrar deneyin.",
       variant: "destructive",
     })
   } finally {
     setYukleniyor(false)
   }
 }

 return (
   <KimlikKorumasi>
   <div className="container mx-auto px-4 py-8">
     <h1 className="text-3xl font-bold mb-8 text-center">Modelinizi Yukleyin</h1>
     <div className="max-w-md mx-auto">
       <div className="mb-8">
         <h2 className="text-xl font-semibold mb-4">Fotograf Cekim Onerileri</h2>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="space-y-4"
         >
           <div className="flex items-center space-x-4">
             <Camera className="w-8 h-8 text-primary" />
             <p>Duz bir arka plan onunde poz verin</p>
           </div>
           <div className="flex items-center space-x-4">
             <Sun className="w-8 h-8 text-primary" />
             <p>Iyi aydinlatilmis bir ortamda cekim yapin</p>
           </div>
           <div className="flex items-center space-x-4">
             <Aperture className="w-8 h-8 text-primary" />
             <p>Tum vucudunuzun gorunur oldugundan emin olun</p>
           </div>
         </motion.div>
       </div>
       <div className="mb-4">
         <Label htmlFor="photo">Fotograf Sec</Label>
         <Input
           id="photo"
           type="file"
           accept="image/*"
           onChange={dosyaDegistiginde}
           disabled={!girisYapildi}
         />
       </div>
       {onizleme && (
         <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="mb-4"
         >
           <Image
             src={onizleme}
             alt="Yuklenen fotograf"
             width={300}
             height={400}
             className="mx-auto rounded-lg shadow-md"
           />
         </motion.div>
       )}
       <Button
         onClick={yukle}
         disabled={!onizleme || !girisYapildi || yukleniyor}
         className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
       >
         {yukleniyor ? "Yukleniyor..." : "Yukle ve Devam Et"}
       </Button>
     </div>
     <GirisModal 
       isOpen={girisModalAcik} 
       onClose={() => setGirisModalAcik(false)} 
       onSuccess={() => {
         setGirisYapildi(true)
         setGirisModalAcik(false)
       }} 
     />
     <KayitModal 
       isOpen={kayitModalAcik} 
       onClose={() => setKayitModalAcik(false)}
       onSuccess={() => {
         setGirisYapildi(true)
         setKayitModalAcik(false)
       }}
     />
   </div>
   </KimlikKorumasi>
 )
}

