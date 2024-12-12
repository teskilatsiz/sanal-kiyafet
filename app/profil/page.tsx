"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBildirim } from "@/components/ui/bildirim"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, CreditCard, Wallet, BanknoteIcon as Bank, Truck, Bitcoin, Smartphone, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Package, TruckIcon, MapPin, CheckCircle } from 'lucide-react'

const onerilenAdresler = [
  "Beyoglu, Istiklal Caddesi No: 123, Istanbul",
  "Kadikoy, Moda Caddesi No: 45, Istanbul",
  "Besiktas, Barbaros Bulvari No: 78, Istanbul",
  "Sisli, Nisantasi Mahallesi, Abdi Ipekci Caddesi No: 56, Istanbul",
  "Uskudar, Kuzguncuk Mahallesi, Carsi Caddesi No: 34, Istanbul"
];

export default function Profil() {
  const [kullanici, setKullanici] = useState<any>(null)
  const [ad, setAd] = useState("")
  const [eposta, setEposta] = useState("")
  const [telefon, setTelefon] = useState("")
  const [adres, setAdres] = useState("")
  const [odemeYontemleri, setOdemeYontemleri] = useState<any[]>([])
  const [yeniKartNumarasi, setYeniKartNumarasi] = useState("")
  const [yeniKartAdi, setYeniKartAdi] = useState("")
  const [yeniKartSonKullanma, setYeniKartSonKullanma] = useState("")
  const [yeniKartCVC, setYeniKartCVC] = useState("")
  const [kuponlar, setKuponlar] = useState<any[]>([])
  const [yeniOdemeYontemi, setYeniOdemeYontemi] = useState("")
  const [bankaAdi, setBankaAdi] = useState("")
  const [hesapNumarasi, setHesapNumarasi] = useState("")
  const [kriptoAdres, setKriptoAdres] = useState("")
  const [telefonNumarasi, setTelefonNumarasi] = useState("")
  const [sonSiparisler, setSonSiparisler] = useState<any[]>([])
  const { bildirim } = useBildirim()
  const [adresGirisi, setAdresGirisi] = useState("")
  const [filtrelenmisAdresler, setFiltrelenmisAdresler] = useState(onerilenAdresler)
  const router = useRouter()

  useEffect(() => {
    const mevcutKullanici = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (mevcutKullanici) {
      setKullanici(mevcutKullanici)
      setAd(mevcutKullanici.username || "")
      setEposta(mevcutKullanici.email || "")
      setTelefon(mevcutKullanici.phone || "")
      setAdres(mevcutKullanici.address || "")
      setOdemeYontemleri(mevcutKullanici.paymentMethods || [])
      setKuponlar(mevcutKullanici.coupons || [])
    }
    const siparisler = JSON.parse(localStorage.getItem('orders') || '[]')
    setSonSiparisler(siparisler.slice(0, 5))
  }, [])

  const kaydet = (e: React.FormEvent) => {
    e.preventDefault()
    const guncellenmisKullanici = { ...kullanici, username: ad, email: eposta, phone: telefon, address: adres, paymentMethods: odemeYontemleri, coupons: kuponlar }
    localStorage.setItem('currentUser', JSON.stringify(guncellenmisKullanici))
    
    const kullanicilar = JSON.parse(localStorage.getItem('users') || '[]')
    const guncellenmisKullanicilar = kullanicilar.map((k: any) => k.username === kullanici.username ? guncellenmisKullanici : k)
    localStorage.setItem('users', JSON.stringify(guncellenmisKullanicilar))
    
    setKullanici(guncellenmisKullanici)
    bildirim({
      title: "Profil Guncellendi",
      description: "Bilgileriniz basariyla kaydedildi.",
      duration: 3000,
    })
  }

  const odemeYontemiEkle = () => {
    let yeniYontem
    switch (yeniOdemeYontemi) {
      case 'credit_card':
        yeniYontem = { tur: 'Kredi Karti', kartNumarasi: yeniKartNumarasi, kartAdi: yeniKartAdi, sonKullanma: yeniKartSonKullanma, cvc: yeniKartCVC }
        break
      case 'digital_wallet':
        yeniYontem = { tur: 'Dijital Cuzdan', ad: yeniKartAdi }
        break
      case 'bank_transfer':
        yeniYontem = { tur: 'Banka Havalesi', bankaAdi, hesapNumarasi }
        break
      case 'cash_on_delivery':
        yeniYontem = { tur: 'Kapida Odeme' }
        break
      case 'crypto':
        yeniYontem = { tur: 'Kripto Para', adres: kriptoAdres }
        break
      case 'sms':
        yeniYontem = { tur: 'SMS ile Odeme', telefonNumarasi }
        break
      default:
        return
    }
    setOdemeYontemleri([...odemeYontemleri, yeniYontem])
    setYeniOdemeYontemi("")
    setYeniKartNumarasi("")
    setYeniKartAdi("")
    setYeniKartSonKullanma("")
    setYeniKartCVC("")
    setBankaAdi("")
    setHesapNumarasi("")
    setKriptoAdres("")
    setTelefonNumarasi("")
    bildirim({
      title: "Odeme Yontemi Eklendi",
      description: "Yeni odeme yontemi basariyla eklendi.",
    })
  }

  const odemeYontemiSil = (index: number) => {
    const guncellenmisOdemeYontemleri = odemeYontemleri.filter((_, i) => i !== index)
    setOdemeYontemleri(guncellenmisOdemeYontemleri)
    bildirim({
      title: "Odeme Yontemi Silindi",
      description: "Odeme yontemi basariyla silindi.",
    })
  }

  const adresGirisiIsle = (deger: string) => {
    setAdresGirisi(deger)
    const kucukHarfDeger = deger.toLowerCase()
    const filtrelenmis = onerilenAdresler.filter(adres => 
      adres.toLowerCase().includes(kucukHarfDeger) || 
      adres.toLowerCase().replace('i', 'ı').includes(kucukHarfDeger)
    )
    setFiltrelenmisAdresler(filtrelenmis)
  }

  const adresSec = (secilenAdres: string) => {
    setAdres(secilenAdres)
    setAdresGirisi(secilenAdres)
  }

  if (!kullanici) {
    return <div className="container mx-auto px-4 py-8">Lutfen giris yapin.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="text-lg">Profil Bilgileri</TabsTrigger>
            <TabsTrigger value="payment" className="text-lg">Odeme Yontemleri</TabsTrigger>
            <TabsTrigger value="coupons" className="text-lg">Kuponlarim</TabsTrigger>
            <TabsTrigger value="orders" className="text-lg">Son Siparisler</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Profil Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={kaydet} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1">Kullanici Adi</label>
                    <Input
                      type="text"
                      id="name"
                      value={ad}
                      onChange={(e) => setAd(e.target.value)}
                      required
                      className="w-full bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">E-posta</label>
                    <Input
                      type="email"
                      id="email"
                      value={eposta}
                      onChange={(e) => setEposta(e.target.value)}
                      required
                      className="w-full bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-1">Telefon Numarasi</label>
                    <Input
                      type="tel"
                      id="phone"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      className="w-full bg-background text-foreground"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="address" className="block text-sm font-medium text-card-foreground mb-1">Adres</label>
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput
                        placeholder="Adres ara..."
                        value={adresGirisi}
                        onValueChange={adresGirisiIsle}
                        className="bg-background text-foreground"
                      />
                      <CommandList>
                        <CommandEmpty>Adres bulunamadi.</CommandEmpty>
                        <CommandGroup heading="Onerilen Adresler">
                          {filtrelenmisAdresler.map((adres) => (
                            <CommandItem
                key={adres}
                              onSelect={() => adresSec(adres)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  adres === adres ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {adres}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-2 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    Kaydet
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Odeme Yontemleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {odemeYontemleri.map((yontem, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-background rounded-lg shadow">
                      <div className="flex items-center">
                        {yontem.tur === 'Kredi Karti' && <CreditCard className="mr-2 text-primary" size={20} />}
                        {yontem.tur === 'Dijital Cuzdan' && <Wallet className="mr-2 text-primary" size={20} />}
                        {yontem.tur === 'Banka Havalesi' && <Bank className="mr-2 text-primary" size={20} />}
                        {yontem.tur === 'Kapida Odeme' && <Truck className="mr-2 text-primary" size={20} />}
                        {yontem.tur === 'Kripto Para' && <Bitcoin className="mr-2 text-primary" size={20} />}
                        {yontem.tur === 'SMS ile Odeme' && <Smartphone className="mr-2 text-primary" size={20} />}
                        <div>
                          <p className="font-semibold text-foreground">{yontem.tur}</p>
                          {yontem.kartNumarasi && <p className="text-sm text-muted-foreground">**** **** **** {yontem.kartNumarasi.slice(-4)}</p>}
                          {yontem.ad && <p className="text-sm text-muted-foreground">{yontem.ad}</p>}
                          {yontem.bankaAdi && <p className="text-sm text-muted-foreground">{yontem.bankaAdi}</p>}
                          {yontem.telefonNumarasi && <p className="text-sm text-muted-foreground">{yontem.telefonNumarasi}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => odemeYontemiSil(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                  <div className="space-y-4">
                    <Select onValueChange={setYeniOdemeYontemi}>
                      <SelectTrigger className="w-full bg-background text-foreground">
                        <SelectValue placeholder="Odeme Yontemi Secin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Kredi ve Banka Kartlari</SelectItem>
                        <SelectItem value="digital_wallet">Dijital Cuzdanlar</SelectItem>
                        <SelectItem value="bank_transfer">Banka Havalesi / EFT</SelectItem>
                        <SelectItem value="cash_on_delivery">Kapida Odeme</SelectItem>
                        <SelectItem value="crypto">Kripto Para</SelectItem>
                        <SelectItem value="sms">SMS ile Odeme</SelectItem>
                      </SelectContent>
                    </Select>
                    {yeniOdemeYontemi === 'credit_card' && (
                      <>
                        <Input
                          type="text"
                          placeholder="Kart Numarasi"
                          value={yeniKartNumarasi}
                          onChange={(e) => setYeniKartNumarasi(e.target.value)}
                          className="bg-background text-foreground"
                        />
                        <Input
                          type="text"
                          placeholder="Kart Uzerindeki Isim"
                          value={yeniKartAdi}
                          onChange={(e) => setYeniKartAdi(e.target.value)}
                          className="bg-background text-foreground"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder="Son Kullanma Tarihi"
                            value={yeniKartSonKullanma}
                            onChange={(e) => setYeniKartSonKullanma(e.target.value)}
                            className="bg-background text-foreground"
                          />
                          <Input
                            type="text"
                            placeholder="CVC"
                            value={yeniKartCVC}
                            onChange={(e) => setYeniKartCVC(e.target.value)}
                            className="bg-background text-foreground"
                          />
                        </div>
                      </>
                    )}
                    {yeniOdemeYontemi === 'digital_wallet' && (
                      <Input
                        type="text"
                        placeholder="Dijital Cuzdan Adi"
                        value={yeniKartAdi}
                        onChange={(e) => setYeniKartAdi(e.target.value)}
                        className="bg-background text-foreground"
                      />
                    )}
                    {yeniOdemeYontemi === 'bank_transfer' && (
                      <>
                        <Input
                          type="text"
                          placeholder="Banka Adi"
                          value={bankaAdi}
                          onChange={(e) => setBankaAdi(e.target.value)}
                          className="bg-background text-foreground"
                        />
                        <Input
                          type="text"
                          placeholder="Hesap Numarasi"
                          value={hesapNumarasi}
                          onChange={(e) => setHesapNumarasi(e.target.value)}
                          className="bg-background text-foreground"
                        />
                      </>
                    )}
                    {yeniOdemeYontemi === 'crypto' && (
                      <Input
                        type="text"
                        placeholder="Kripto Para Adresi"
                        value={kriptoAdres}
                        onChange={(e) => setKriptoAdres(e.target.value)}
                        className="bg-background text-foreground"
                      />
                    )}
                    {yeniOdemeYontemi === 'sms' && (
                      <Input
                        type="text"
                        placeholder="Telefon Numarasi"
                        value={telefonNumarasi}
                        onChange={(e) => setTelefonNumarasi(e.target.value)}
                        className="bg-background text-foreground"
                      />
                    )}
                    <Button
                      onClick={odemeYontemiEkle}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 transform hover:scale-105"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Yeni Odeme Yontemi Ekle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="coupons">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Kuponlarim</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg text-white"
                >
                  <h3 className="text-2xl font-bold mb-4">Kupon Kazanma Rehberi</h3>
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h4 className="text-lg font-semibold mb-2">Alisveris Tutarina Gore Kuponlar</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>500 TL uzeri alisverislerde %10 indirim kuponu</li>
                        <li>1000 TL uzeri alisverislerde %15 indirim kuponu</li>
                        <li>Diger tum alisverislerde %5 indirim kuponu</li>
                      </ul>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h4 className="text-lg font-semibold mb-2">Ozel Gunler ve Kampanyalar</h4>
                      <p>Dogum gununuz, yilbasi ve bayram gibi ozel gunlerde ekstra kuponlar kazanin!</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <h4 className="text-lg font-semibold mb-2">Arkadas Davetleri</h4>
                      <p>Arkadaslarinizi davet edin, her basarili davet icin %5 indirim kuponu kazanin!</p>
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-4 text-sm"
                  >
                    Kuponlar bir sonraki alisverisinizdee kullanilmak uzere 30 gun gecerlidir.
                  </motion.p>
                </motion.div>
                {kuponlar.length > 0 ? (
                  <div className="grid gap-4">
                    {kuponlar.map((kupon, index) => (
                      <div key={index} className="p-4 bg-background rounded-lg shadow flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-foreground">{kupon.code}</p>
                          <p className="text-sm text-muted-foreground">%{kupon.discount} indirim</p>
                          <p className="text-xs text-muted-foreground">Son Kullanma: {new Date(kupon.expiryDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(kupon.code)
                            bildirim({
                              title: "Kupon Kopyalandi",
                              description: "Kupon kodu panoya kopyalandi.",
                            })
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 transform hover:scale-105"
                        >
                          Kopyala
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Henuz kuponunuz bulunmamaktadir.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Son Siparisler</CardTitle>
              </CardHeader>
              <CardContent>
                {sonSiparisler.length > 0 ? (
                  <div className="space-y-4">
                    {sonSiparisler.map((siparis) => (
                      <div
                        key={siparis.id}
                        className="flex justify-between items-center p-4 bg-background rounded-lg shadow cursor-pointer hover:bg-accent transition-colors duration-200"
                        onClick={() => router.push(`/siparisler/${siparis.id}`)}
                      >
                        <div>
                          <p className="font-semibold text-foreground">Siparis #{siparis.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(siparis.date).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <p className="font-bold text-foreground">{siparis.total.toFixed(2)} TL</p>
                            <p className="text-sm text-muted-foreground">{siparis.status}</p>
                          </div>
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                            {siparis.status === 'Hazirlaniyor' && <Package className="w-6 h-6 text-white" />}
                            {siparis.status === 'Yola Cikti' && <TruckIcon className="w-6 h-6 text-white" />}
                            {siparis.status === 'Dagitimda' && <MapPin className="w-6 h-6 text-white" />}
                            {siparis.status === 'Teslim Edildi' && <CheckCircle className="w-6 h-6 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Henuz siparisiniz bulunmamaktadir.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

