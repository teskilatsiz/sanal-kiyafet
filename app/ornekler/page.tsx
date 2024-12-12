import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const modeller = [
 { 
   id: 1, 
   ad: "Kadın Model", 
   resim: "https://st2.depositphotos.com/5326338/7958/i/450/depositphotos_79581596-stock-photo-angelina-jolie-at-los-angeles.jpg",
   kategori: "Yetişkin",
   cinsiyet: "Kadın"
 },
 { 
   id: 2, 
   ad: "Erkek Model", 
   resim: "https://i.hizliresim.com/fkzlrpq.png",
   kategori: "Yetişkin",
   cinsiyet: "Erkek"
 },
 { 
   id: 3, 
   ad: "Çocuk Model", 
   resim: "https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&w=400&h=600",
   kategori: "Çocuk",
   cinsiyet: "Kız"
 },
 { 
   id: 4, 
   ad: "Bebek Model", 
   resim: "https://images.unsplash.com/photo-1607975218223-94f82613e833?auto=format&fit=crop&w=400&h=600",
   kategori: "Bebek",
   cinsiyet: "Erkek"
 },
]

const GradyanButon = ({ children, className = "" }) => (
 <Button
   className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:scale-105 ${className}`}
 >
   {children}
 </Button>
)

export default function Modeller() {
 return (
   <div className="container mx-auto px-4 py-8 bg-background">
     <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
       Örnek Modeller
     </h1>
     <p className="text-center text-lg mb-8 text-muted-foreground">
       Kıyafetleri denemek için bir model seçin veya kendi fotoğrafınızı yükleyin.
     </p>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
       {modeller.map((model) => (
         <div key={model.id}>
           <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
             <CardHeader className="p-0">
               <div className="relative aspect-[2/3]">
                 <Image
                   src={model.resim}
                   alt={model.ad}
                   layout="fill"
                   objectFit="cover"
                   className="transition-transform duration-300 hover:scale-105"
                   priority
                   loading="eager"
                 />
               </div>
             </CardHeader>
             <CardContent className="p-4">
               <CardTitle className="text-xl font-semibold mb-2">{model.ad}</CardTitle>
               <div className="flex space-x-2">
                 <Badge variant="secondary">{model.kategori}</Badge>
                 <Badge variant="outline">{model.cinsiyet}</Badge>
               </div>
             </CardContent>
             <CardFooter className="p-4">
               <GradyanButon asChild className="w-full">
                 <Link href={`/urun-dene/${model.id}`}>Bu Modeli Seç</Link>
               </GradyanButon>
             </CardFooter>
           </Card>
         </div>
       ))}
     </div>
     <div className="mt-12 text-center">
       <h2 className="text-2xl font-semibold mb-4">Kendi Fotoğrafınızı mı Kullanmak İstiyorsunuz?</h2>
       <p className="text-muted-foreground mb-6">
         Kendi fotoğrafınızı yükleyerek kıyafetleri kendinizde deneyebilirsiniz.
       </p>
       <GradyanButon asChild>
         <Link href="/yukle">Fotoğraf Yükle</Link>
       </GradyanButon>
     </div>
   </div>
 )
}

