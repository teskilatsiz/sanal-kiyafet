import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const MenuOgesi = ({ href, children }) => (
 <li>
   <Link href={href} className="text-muted-foreground hover:text-primary transition-colors">
     {children}
   </Link>
 </li>
)

const SosyalIkon = ({ href, icon: Icon }) => (
 <a
   href={href}
   target="_blank"
   rel="noopener noreferrer"
   className="text-muted-foreground hover:text-foreground transition-colors"
 >
   <Icon size={20} />
 </a>
)

export function AltBilgi() {
 return (
   <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
     <div className="container mx-auto px-4 py-8">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div>
           <h3 className="font-bold text-lg mb-4">Sanal Kıyafet</h3>
           <p className="text-sm text-muted-foreground">
             Kendi fotoğrafında veya örnek modellerde kıyafetleri dene!
           </p>
         </div>
         <div>
           <h4 className="font-semibold mb-4">Hızlı Bağlantılar</h4>
           <ul className="space-y-2">
             <MenuOgesi href="/">Ana Sayfa</MenuOgesi>
             <MenuOgesi href="/ornekler">Örnek Modeller</MenuOgesi>
             <MenuOgesi href="/yukle">Modelini Yükle</MenuOgesi>
             <MenuOgesi href="/urunler">Ürünler</MenuOgesi>
           </ul>
         </div>
         <div>
           <h4 className="font-semibold mb-4">Yardım</h4>
           <ul className="space-y-2">
             <MenuOgesi href="/sss">SSS</MenuOgesi>
             <MenuOgesi href="/iletisim">İletişim</MenuOgesi>
             <MenuOgesi href="/gizlilik">Gizlilik Politikası</MenuOgesi>
             <MenuOgesi href="/kullanim-sartlari">Kullanım Şartları</MenuOgesi>
           </ul>
         </div>
         <div>
           <h4 className="font-semibold mb-4">Bizi Takip Edin</h4>
           <div className="flex space-x-4">
             <SosyalIkon href="#" icon={Facebook} />
             <SosyalIkon href="#" icon={Twitter} />
             <SosyalIkon href="#" icon={Instagram} />
             <SosyalIkon href="#" icon={Linkedin} />
           </div>
         </div>
       </div>
       <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
         <p>&copy; 2024 Sanal Kıyafet. Tüm hakları saklıdır.</p>
         <p>Geliştirici: Teşkilatsız</p>
       </div>
     </div>
   </footer>
 )
}

