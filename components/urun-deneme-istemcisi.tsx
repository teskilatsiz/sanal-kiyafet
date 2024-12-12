"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBildirim } from "@/components/ui/bildirim"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Check, Shirt, Filter } from 'lucide-react'
import { GirisModal } from "@/components/giris-modal"
import { KayitModal } from "@/components/kayit-modal"
import { KimlikKorumasi } from "@/components/kimlik-korumasi"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

const markalar = ["Amazon", "Trendyol", "LC Waikiki", "Koton", "H&M", "Bershka", "Defacto", "Mavi", "Zara", "Nike", "Michael Kors", "Carter's"]
const kategoriler = [
  "T-shirt", "Gömlek", "Kazak", "Ceket", "Mont",
  "Pantolon", "Şort", "Etek", "Elbise", "Tulum",
  "Ayakkabı", "Çanta", "Aksesuar", "Pijama"
]
const cinsiyetler = ["Kadın", "Erkek", "Unisex"]
const yasGruplari = ["Yetişkin", "Çocuk", "Bebek"]

const ornekUrunler = [
  { id: 1, ad: "Beyaz V Yaka T-shirt", marka: "H&M", kategori: "T-shirt", cinsiyet: "Unisex", yasGrubu: "Yetişkin", resim: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&h=1600&q=80", fiyat: 129.99 },
  { id: 2, ad: "Mavi Slim Fit Kot Pantolon", marka: "Mavi", kategori: "Pantolon", cinsiyet: "Unisex", yasGrubu: "Yetişkin", resim: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&h=1600&q=80", fiyat: 299.99 },
  { id: 3, ad: "Çiçek Desenli Yazlık Elbise", marka: "Koton", kategori: "Elbise", cinsiyet: "Kadın", yasGrubu: "Yetişkin", resim: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&h=1600&q=80", fiyat: 199.99 },
  { id: 4, ad: "Renkli Baskılı Çocuk T-shirt", marka: "LC Waikiki", kategori: "T-shirt", cinsiyet: "Unisex", yasGrubu: "Çocuk", resim: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&h=1600&q=80", fiyat: 79.99 },
  { id: 5, ad: "Yumuşak Pamuklu Bebek Tulumu", marka: "Carter's", kategori: "Tulum", cinsiyet: "Unisex", yasGrubu: "Bebek", resim: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&h=1600&q=80", fiyat: 149.99 },
]

export function UrunDenemeIstemcisi({ id }: { id: string }) {
  const [filtreler, setFiltreler] = useState({
    marka: "all",
    kategori: "all",
    cinsiyet: "all",
    yasGrubu: "all",
    fiyatAraligi: "all"
  })
  const [secilenUrun, setSecilenUrun] = useState<typeof ornekUrunler[0] | null>(null)
  const [kullaniciResmi, setKullaniciResmi] = useState<string | null>(null)
  const [girisYapildi, setGirisYapildi] = useState(false)
  const [girisModalAcik, setGirisModalAcik] = useState(false)
  const [kayitModalAcik, setKayitModalAcik] = useState(false)
  const [denemeYapiliyor, setDenemeYapiliyor] = useState(false)
  const [filtreleriGoster, setFiltreleriGoster] = useState(false)
  const [sepetUrunSayisi, setSepetUrunSayisi] = useState(0)
  const { bildirim } = useBildirim()
  const modelRef = useRef<HTMLDivElement>(null)
  const [filtreAdimlariniGoster, setFiltreAdimlariniGoster] = useState(false)
  const [mevcutAdim, setMevcutAdim] = useState(0)
  const [adimCevaplari, setAdimCevaplari] = useState({
    urunTipi: "",
    marka: "",
    cinsiyet: "",
    yasGrubu: "",
    fiyatAraligi: ""
  })

  useEffect(() => {
    if (id === "user") {
      const kaydedilenResim = localStorage.getItem("userImage")
      if (kaydedilenResim) {
        setKullaniciResmi(kaydedilenResim)
      }
    }
    const mevcutKullanici = JSON.parse(localStorage.getItem('currentUser') || 'null')
    setGirisYapildi(!!mevcutKullanici)
    const sepet = JSON.parse(localStorage.getItem('cart') || '[]')
    setSepetUrunSayisi(sepet.length)
    const filtreAdimlariniGordu = localStorage.getItem('hasSeenFilterSteps')
    if (!filtreAdimlariniGordu) {
      setFiltreAdimlariniGoster(true)
      localStorage.setItem('hasSeenFilterSteps', 'true')
    }
  }, [id])

  const filtrelenmisUrunler = ornekUrunler.filter(
    (urun) =>
      (filtreler.marka === "all" || urun.marka === filtreler.marka) &&
      (filtreler.kategori === "all" || urun.kategori === filtreler.kategori) &&
      (filtreler.cinsiyet === "all" || urun.cinsiyet === filtreler.cinsiyet) &&
      (filtreler.yasGrubu === "all" || urun.yasGrubu === filtreler.yasGrubu) &&
      (filtreler.fiyatAraligi === "all" || (
        (filtreler.fiyatAraligi === "0-100" && urun.fiyat <= 100) ||
        (filtreler.fiyatAraligi === "100-250" && urun.fiyat > 100 && urun.fiyat <= 250) ||
        (filtreler.fiyatAraligi === "250-500" && urun.fiyat > 250 && urun.fiyat <= 500) ||
        (filtreler.fiyatAraligi === "500+" && urun.fiyat > 500)
      ))
  )

  const modelResmi = id === "user" ? kullaniciResmi : 
    id === "1" ? "https://st2.depositphotos.com/5326338/7958/i/450/depositphotos_79581596-stock-photo-angelina-jolie-at-los-angeles.jpg" : 
    id === "2" ? "https://i.hizliresim.com/fkzlrpq.png" : 
    id === "3" ? "https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&w=400&h=600" : 
    "https://images.unsplash.com/photo-1607975218223-94f82613e833?auto=format&fit=crop&w=400&h=600"

  const sepeteEkle = (urun: typeof ornekUrunler[0]) => {
    if (!girisYapildi) {
      girisUyarisiGoster("Ürünleri sepete eklemek için lütfen giriş yapın veya kayıt olun.")
      return
    }

    const sepet = JSON.parse(localStorage.getItem('cart') || '[]')
    const mevcutUrunIndex = sepet.findIndex((item: any) => item.id === urun.id)

    if (mevcutUrunIndex !== -1) {
      sepet[mevcutUrunIndex].miktar += 1
    } else {
      sepet.push({
        id: urun.id,
        ad: urun.ad,
        marka: urun.marka,
        fiyat: urun.fiyat,
        resim: urun.resim,
        miktar: 1
      })
    }

    localStorage.setItem('cart', JSON.stringify(sepet))
    bildirim({
      title: "Ürün Sepete Eklendi",
      description: `${urun.ad} sepetinize eklendi.`,
      action: (
        <div className="animate-scale-in">
          <Check className="text-green-500 h-6 w-6" />
        </div>
      ),
    })
    setSepetUrunSayisi(sepet.length)
  }

  const modeleKaydir = () => {
    if (modelRef.current) {
      modelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const urunuDene = (urun: typeof ornekUrunler[0]) => {
    if (!girisYapildi) {
      girisUyarisiGoster("Ürünleri denemek için lütfen giriş yapın veya kayıt olun.")
      return
    }
    setDenemeYapiliyor(true)
    modeleKaydir()
    setTimeout(() => {
      setSecilenUrun(urun)
      setDenemeYapiliyor(false)
    }, 3000)
  }

  const girisUyarisiGoster = (mesaj: string) => {
    bildirim({
      title: "Giriş Yapmanız Gerekiyor",
      description: mesaj,
      action: (
        <div className="flex space-x-2">
          <Button onClick={() => setGirisModalAcik(true)}>Giriş Yap</Button>
          <Button onClick={() => setKayitModalAcik(true)}>Kayıt Ol</Button>
        </div>
      ),
    })
  }

  const yapayZekaEfektiUygula = (modelResmi: string, urunResmi: string) => {
    return (
      <div className="relative w-full h-full">
        <Image
          src={modelResmi}
          alt="Model"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={urunResmi}
            alt="Ürün"
            layout="fill"
            objectFit="contain"
            className="mix-blend-multiply"
          />
        </div>
      </div>
    )
  }

  const adimCevabiniIsle = (cevap: string) => {
    setAdimCevaplari({ ...adimCevaplari, [Object.keys(adimCevaplari)[mevcutAdim]]: cevap })
    if (mevcutAdim < 4) {
      setMevcutAdim(mevcutAdim + 1)
    } else {
      setFiltreAdimlariniGoster(false)
      setFiltreler({
        kategori: adimCevaplari.urunTipi,
        marka: adimCevaplari.marka,
        cinsiyet: adimCevaplari.cinsiyet,
        yasGrubu: adimCevaplari.yasGrubu,
        fiyatAraligi: adimCevaplari.fiyatAraligi
      })
    }
  }

  return (
    <KimlikKorumasi>
      <div className="container mx-auto px-4 py-8 bg-background space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Kıyafet Deneme - {id === "user" ? "Kendi Fotoğrafınız" : `Model ${id}`}
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 p-4" ref={modelRef}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-card-foreground">
              {id === "user" ? "Kendi Fotoğrafınız" : `Model ${id}`}
            </h2>
            {modelResmi && (
              <div className="relative pb-[150%] overflow-hidden">
                <AnimatePresence>
                  {denemeYapiliyor ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg overflow-hidden"
                    >
                      <div className="text-white text-center">
                        <motion.div
                          className="w-full h-full max-w-[300px] max-h-[500px] relative mx-auto"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent"
                            initial={{ y: "100%" }}
                            animate={{ y: "-100%" }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{ opacity: 0.2 }}
                          />
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
                                x: Math.random() * 200 - 100,
                                y: Math.random() * 200 - 100,
                              }}
                              transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </motion.div>
                        <p className="text-lg font-semibold mt-4">Yapay zeka fotoğrafınızı işliyor...</p>
                      </div>
                    </motion.div>
                  ) : secilenUrun ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      {yapayZekaEfektiUygula(modelResmi, secilenUrun.resim)}
                    </motion.div>
                  ) : (
                    <Image
                      src={modelResmi}
                      alt={id === "user" ? "Kendi Fotoğrafınız" : `Model ${id}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-md"
                      priority
                      loading="eager"
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="w-full lg:w-2/3 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Ürünler</h2>
              <Button onClick={() => setFiltreleriGoster(!filtreleriGoster)} variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filtreler
              </Button>
            </div>
            <AnimatePresence>
              {filtreleriGoster && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 bg-card rounded-lg shadow-md"
                >
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Marka</label>
                    <Select
                      onValueChange={(value) => setFiltreler({ ...filtreler, marka: value })}
                      value={filtreler.marka}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Marka Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {markalar.map((marka) => (
                          <SelectItem key={marka} value={marka}>{marka}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Kategori</label>
                    <Select
                      onValueChange={(value) => setFiltreler({ ...filtreler, kategori: value })}
                      value={filtreler.kategori}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {kategoriler.map((kategori) => (
                          <SelectItem key={kategori} value={kategori}>{kategori}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Cinsiyet</label>
                    <Select
                      onValueChange={(value) => setFiltreler({ ...filtreler, cinsiyet: value })}
                      value={filtreler.cinsiyet}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cinsiyet Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {cinsiyetler.map((cinsiyet) => (
                          <SelectItem key={cinsiyet} value={cinsiyet}>{cinsiyet}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Yaş Grubu</label>
                    <Select
                      onValueChange={(value) => setFiltreler({ ...filtreler, yasGrubu: value })}
                      value={filtreler.yasGrubu}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Yaş Grubu Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {yasGruplari.map((yasGrubu) => (
                          <SelectItem key={yasGrubu} value={yasGrubu}>{yasGrubu}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Fiyat Aralığı</label>
                    <Select
                      onValueChange={(value) => setFiltreler({ ...filtreler, fiyatAraligi: value })}
                      value={filtreler.fiyatAraligi}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fiyat Aralığı Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="0-100">0 - 100 TL</SelectItem>
                        <SelectItem value="100-250">100 - 250 TL</SelectItem>
                        <SelectItem value="250-500">250 - 500 TL</SelectItem>
                        <SelectItem value="500+">500 TL ve üzeri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtrelenmisUrunler.map((urun) => {
                const sepetteMi = JSON.parse(localStorage.getItem('cart') || '[]').some((item: any) => item.id === urun.id)
                return (
                  <motion.div
                    key={urun.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
                    aria-label={`${urun.ad} - ${urun.fiyat.toFixed(2)} TL`}
                  >
                    <div className="relative pb-[100%] mb-2">
                      <Image
                        src={urun.resim}
                        alt={urun.ad}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        priority
                        loading="eager"
                      />
                    </div>
                    <h3 className="font-semibold text-center text-card-foreground text-sm sm:text-base line-clamp-2">{urun.ad}</h3>
                    <p className="text-center text-xs sm:text-sm text-muted-foreground">{urun.marka}</p>
                    <p className="text-center text-base sm:text-lg font-bold mt-2 text-primary">{urun.fiyat.toFixed(2)} TL</p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button
                        onClick={() => urunuDene(urun)}
                        className="flex-1 py-2 px-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 transform hover:scale-105"
                        disabled={!girisYapildi}
                      >
                        <Shirt className="w-4 h-4 mr-2" />
                        Dene
                      </Button>
                      <Button
                        onClick={() => sepeteEkle(urun)}
                        className="flex-1 py-2 px-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 transform hover:scale-105"
                        disabled={!girisYapildi}
                      >
                        {JSON.parse(localStorage.getItem('cart') || '[]').some((item: any) => item.id === urun.id) ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Sepette
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Sepete Ekle
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
        <GirisModal 
          isOpen={girisModalAcik} 
          onClose={() => setGirisModalAcik(false)} 
          onSuccess={() => {
            setGirisYapildi(true)
            setGirisModalAcik(false)
          }} />
        <KayitModal 
          isOpen={kayitModalAcik} 
          onClose={() => setKayitModalAcik(false)}
          onSuccess={() => {
            setGirisYapildi(true)
            setKayitModalAcik(false)
          }}
        />
        {filtreAdimlariniGoster && (
          <Dialog open={filtreAdimlariniGoster} onOpenChange={setFiltreAdimlariniGoster}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ürün Tercihleri</DialogTitle>
                <DialogDescription>
                  Size en uygun ürünleri göstermek için birkaç soru soracağız.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {mevcutAdim === 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Ne tür bir ürün arıyorsunuz?</h4>
                    {kategoriler.map((kategori) => (
                      <Button key={kategori} onClick={() => adimCevabiniIsle(kategori)} className="mr-2 mb-2">
                        {kategori}
                      </Button>
                    ))}
                  </div>
                )}
                {mevcutAdim === 1 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Hangi markayı tercih edersiniz?</h4>
                    {markalar.map((marka) => (
                      <Button key={marka} onClick={() => adimCevabiniIsle(marka)} className="mr-2 mb-2">
                        {marka}
                      </Button>
                    ))}
                  </div>
                )}
                {mevcutAdim === 2 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Hangi cinsiyet için alışveriş yapıyorsunuz?</h4>
                    {cinsiyetler.map((cinsiyet) => (
                      <Button key={cinsiyet} onClick={() => adimCevabiniIsle(cinsiyet)} className="mr-2 mb-2">
                        {cinsiyet}
                      </Button>
                    ))}
                  </div>
                )}
                {mevcutAdim === 3 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Hangi yaş grubu için alışveriş yapıyorsunuz?</h4>
                    {yasGruplari.map((yasGrubu) => (
                      <Button key={yasGrubu} onClick={() => adimCevabiniIsle(yasGrubu)} className="mr-2 mb-2">
                        {yasGrubu}
                      </Button>
                    ))}
                  </div>
                )}
                {mevcutAdim === 4 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Hangi fiyat aralığını tercih edersiniz?</h4>
                    <Button onClick={() => adimCevabiniIsle("0-100")} className="mr-2 mb-2">0 - 100 TL</Button>
                    <Button onClick={() => adimCevabiniIsle("100-250")} className="mr-2 mb-2">100 - 250 TL</Button>
                    <Button onClick={() => adimCevabiniIsle("250-500")} className="mr-2 mb-2">250 - 500 TL</Button>
                    <Button onClick={() => adimCevabiniIsle("500+")} className="mr-2 mb-2">500 TL ve üzeri</Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setFiltreAdimlariniGoster(false)}>Atla</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </KimlikKorumasi>
  )
}

