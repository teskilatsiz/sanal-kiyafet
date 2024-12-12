"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GirisModal } from "@/components/giris-modal"
import { KayitModal } from "@/components/kayit-modal"

interface KimlikKorumasiProps {
 children: React.ReactNode
}

const korunmayacakSayfalar = ['/', '/ornekler'];

export function KimlikKorumasi({ children }: KimlikKorumasiProps) {
 const [girisYapildi, setGirisYapildi] = useState(false)
 const [kimlikDialogGoster, setKimlikDialogGoster] = useState(false)
 const [girisModalAcik, setGirisModalAcik] = useState(false)
 const [kayitModalAcik, setKayitModalAcik] = useState(false)
 const router = useRouter()
 const pathname = usePathname()

 useEffect(() => {
   try {
     const mevcutKullanici = JSON.parse(localStorage.getItem('currentUser') || 'null')
     if (mevcutKullanici) {
       setGirisYapildi(true)
     } else if (!korunmayacakSayfalar.includes(pathname)) {
       setKimlikDialogGoster(true)
     }
   } catch (error) {
     console.error("Kullanıcı bilgileri alınırken hata oluştu:", error)
     if (!korunmayacakSayfalar.includes(pathname)) {
       setKimlikDialogGoster(true)
     }
   }
 }, [pathname])

 const girisYap = () => {
   setGirisModalAcik(true)
   setKimlikDialogGoster(false)
 }

 const kayitOl = () => {
   setKayitModalAcik(true)
   setKimlikDialogGoster(false)
 }

 const girisBasarili = () => {
   setGirisYapildi(true)
   setGirisModalAcik(false)
   setKimlikDialogGoster(false)
   window.location.reload()
 }

 const kayitBasarili = () => {
   setGirisYapildi(true)
   setKayitModalAcik(false)
   setKimlikDialogGoster(false)
   window.location.reload()
 }

 if (girisYapildi || korunmayacakSayfalar.includes(pathname)) {
   return <>{children}</>
 }

 return (
   <>
     <Dialog open={kimlikDialogGoster} onOpenChange={setKimlikDialogGoster}>
       <DialogContent className="sm:max-w-[425px]">
         <DialogHeader>
           <DialogTitle className="text-2xl font-bold text-center mb-2">Hoş Geldiniz!</DialogTitle>
           <DialogDescription className="text-center">
             Bu sayfayı görüntülemek için lütfen giriş yapın veya kayıt olun.
           </DialogDescription>
         </DialogHeader>
         <div className="mt-6">
           <div className="space-y-4">
             <Button onClick={girisYap} className="w-full py-2 text-lg font-semibold">
               Giriş Yap
             </Button>
             <Button onClick={kayitOl} variant="outline" className="w-full py-2 text-lg font-semibold">
               Kayıt Ol
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
     <GirisModal 
       isOpen={girisModalAcik}
       onClose={() => setGirisModalAcik(false)}
       onSuccess={girisBasarili}
     />
     <KayitModal
       isOpen={kayitModalAcik}
       onClose={() => setKayitModalAcik(false)}
       onSuccess={kayitBasarili}
     />
   </>
 )
}

