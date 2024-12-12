"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBildirim } from "@/components/ui/bildirim"
import { CheckCircle, XCircle, CreditCard, Wallet, BanknoteIcon as Bank, Truck, Bitcoin, Smartphone, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GirisModal } from "@/components/giris-modal"
import { KayitModal } from "@/components/kayit-modal"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import cn from 'classnames'
import { useRouter } from "next/navigation"
import { KimlikKorumasi } from "@/components/kimlik-korumasi"

const GradyanButon = ({ children, className = "" }) => (
  <Button
    className={`bg-gradient-to-r from-purple-600 to-pink-600 text-primary transition-all duration-300 hover:scale-105 ${className}`}
  >
    {children}
  </Button>
)

const adimlar = ["Sepet", "Teslimat", "Ödeme", "Onay"]

const KDV_ORANI = 0.18 // 18% KDV
const KARGO_UCRETI = 29.99 // 29.99 TL kargo ücreti

const onerilenAdresler = [
  "Beyoglu, Istiklal Caddesi No: 123, Istanbul",
  "Kadikoy, Moda Caddesi No: 45, Istanbul",
  "Besiktas, Barbaros Bulvari No: 78, Istanbul",
  "Sisli, Nisantasi Mahallesi, Abdi Ipekci Caddesi No: 56, Istanbul",
  "Uskudar, Kuzguncuk Mahallesi, Carsi Caddesi No: 34, Istanbul"
];

export default function Sepet() {
  const [sepet, setSepet] = useState<any[]>([])
  const [aratoplam, setAraToplam] = useState(0)
  const [toplam, setToplam] = useState(0)
  const [suankiAdim, setSuankiAdim] = useState(0)
  const [adres, setAdres] = useState("")
  const [secimiOdemeYontemi, setSecimiOdemeYontemi] = useState("")
  const [odemeYontemleri, setOdemeYontemleri] = useState<any[]>([])
  const [kuponlar, setKuponlar] = useState<any[]>([])
  const [secimiKupon, setSecimiKupon] = useState("")
  const [kuponGirisi, setKuponGirisi] = useState("")
  const [uygulanmisKupon, setUygulanmisKupon] = useState<any>(null)
  const { bildirim } = useBildirim()
  const [yeniOdemeYontemi, setYeniOdemeYontemi] = useState("")
  const [kartNumarasi, setKartNumarasi] = useState("")
  const [kartUzerindekiIsim, setKartUzerindekiIsim] = useState("")
  const [kartSonKullanmaTarihi, setKartSonKullanmaTarihi] = useState("")
  const [kartCVC, setKartCVC] = useState("")
  const [bankaAdi, setBankaAdi] = useState("")
  const [hesapNumarasi, setHesapNumarasi] = useState("")
  const [kriptoParaAdresi, setKriptoParaAdresi] = useState("")
  const [telefonNumarasi, setTelefonNumarasi] = useState("")
  const [girisYapildi, setGirisYapildi] = useState(false)
  const [girisModaliAcik, setGirisModaliAcik] = useState(false)
  const [kayitModaliAcik, setKayitModaliAcik] = useState(false)
  const [odemeIsleniyor, setOdemeIsleniyor] = useState(false)
  const [odemeDurumu, setOdemeDurumu] = useState<"success" | "error" | null>(null)
  const [adresOnerileri, setAdresOnerileri] = useState<string[]>([]);
  const [onerileriGoster, setOnerileriGoster] = useState(false);
  const adresGirisiRef = useRef<HTMLInputElement>(null);
  const [adresGirisi, setAdresGirisi] = useState("")
  const [filtrelenmisAdresler, setFiltrelenmisAdresler] = useState(onerilenAdresler)
  const router = useRouter()
  const [siparisNo, setSiparisNo] = useState<string | null>(null)
  const { bildirim: bildirim2 } = useBildirim

  useEffect(() => {
    const mevcutKullanici = JSON.parse(localStorage.getItem('mevcutKullanici') || 'null')
    setGirisYapildi(!!mevcutKullanici)

    if (mevcutKullanici) {
      const kaydedilenSepet = JSON.parse(localStorage.getItem('sepet') || '[]')
      const dogrulanmisSepet = kaydedilenSepet.map((urun: any) => ({
        ...urun,
        fiyat: typeof urun.fiyat === 'number' ? urun.fiyat : 0,
        miktar: typeof urun.miktar === 'number' ? urun.miktar : 1
      }));
      setSepet(dogrulanmisSepet)
      toplamHesapla(dogrulanmisSepet)
      setOdemeYontemleri(mevcutKullanici.odemeYontemleri || [])
      setKuponlar(mevcutKullanici.kuponlar || [])
      setAdres(mevcutKullanici.adres || "")
    } else {
      girisUyarisiniGoster()
    }

    const kullanicilar = JSON.parse(localStorage.getItem('kullanicilar') || '[]')
    if (!kullanicilar.some((k: any) => k.kullaniciAdi === 'teskilatsiz')) {
      const yeniKullanici = {
        kullaniciAdi: 'teskilatsiz',
        sifre: '123456',
        eposta: 'teskilatsiz@example.com',
        kuponlar: [
          {
            kod: 'HOSGELDIN10',
            indirim: 10,
            sonKullanmaTarihi: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            kod: 'YAZ20',
            indirim: 20,
            sonKullanmaTarihi: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            kod: 'OZEL15',
            indirim: 15,
            sonKullanmaTarihi: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            kod: 'FIRSATLAR25',
            indirim: 25,
            sonKullanmaTarihi: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        ]
      }
      kullanicilar.push(yeniKullanici)
      localStorage.setItem('kullanicilar', JSON.stringify(kullanicilar))
    }
  }, [])

  // calculateTotal fonksiyonunu güncelle
  const toplamHesapla = (sepetUrunleri: any[], uygulanmisKupon: any = null) => {
    const yeniAraToplam = sepetUrunleri.reduce((sum, urun) => {
      const urunFiyati = typeof urun.fiyat === 'number' ? urun.fiyat : 0;
      const urunMiktari = typeof urun.miktar === 'number' ? urun.miktar : 1;
      return sum + urunFiyati * urunMiktari;
    }, 0);

    let indirimliAraToplam = yeniAraToplam;

    if (uygulanmisKupon && typeof uygulanmisKupon.indirim === 'number') {
      const indirimTutari = yeniAraToplam * (uygulanmisKupon.indirim / 100);
      indirimliAraToplam = yeniAraToplam - indirimTutari;
    }

    const kdv = indirimliAraToplam * KDV_ORANI;
    const yeniToplam = indirimliAraToplam + kdv + KARGO_UCRETI;

    setAraToplam(yeniAraToplam);
    setToplam(yeniToplam);
  };

  const sepettenKaldir = (index: number) => {
    const yeniSepet = [...sepet]
    yeniSepet.splice(index, 1)
    setSepet(yeniSepet)
    localStorage.setItem('sepet', JSON.stringify(yeniSepet))
    toplamHesapla(yeniSepet, uygulanmisKupon)
  }

  const sonrakiAdimaGeç = () => {
    if (suankiAdim < adimlar.length - 1) {
      setSuankiAdim(suankiAdim + 1)
      bildirim({
        title: "Adım Tamamlandı",
        description: "Bir sonraki adıma geçiliyor.",
      })
    }
  }

  const oncekiAdimaDon = () => {
    if (suankiAdim > 0) {
      setSuankiAdim(suankiAdim - 1)
    }
  }


  const odemeyiYap = async (e: React.FormEvent) => {
    e.preventDefault()
    setOdemeIsleniyor(true)
    
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setOdemeDurumu("success")
    const mevcutKullanici = JSON.parse(localStorage.getItem('mevcutKullanici') || 'null')
    if (mevcutKullanici) {
      const yeniKupon = kuponOlustur(sepet)
      mevcutKullanici.kuponlar = [...(mevcutKullanici.kuponlar || []), yeniKupon]
      localStorage.setItem('mevcutKullanici', JSON.stringify(mevcutKullanici))
    }
    
    const siparisNo = Math.random().toString(36).substr(2, 9)
    const yeniSiparis = {
      id: siparisNo,
      tarih: new Date().toISOString(),
      durum: "Hazırlanıyor",
      toplam: toplam,
      urunler: sepet.map((urun: any) => ({
        id: urun.id,
        ad: urun.ad,
        fiyat: urun.fiyat,
        miktar: urun.miktar,
        resim: urun.resim
      })),
      odemeYontemi: secimiOdemeYontemi,
      odemeDetaylari: "XXXX XXXX XXXX 1234",
      teslimatAdresi: adres,
      teslimatYontemi: "Standart Teslimat",
      uygulanmisKupon: uygulanmisKupon
    }
    const siparisler = JSON.parse(localStorage.getItem('siparisler') || '[]')
    siparisler.push(yeniSiparis)
    localStorage.setItem('siparisler', JSON.stringify(siparisler))
    
    setSepet([])
    localStorage.setItem('sepet', '[]')
    setToplam(0)
    setSuankiAdim(3)
    setOdemeIsleniyor(false)
    setSiparisNo(siparisNo)
  }

  const kuponOlustur = (sepet: any[]) => {
    const toplamTutar = sepet.reduce((sum, urun) => sum + urun.fiyat, 0)
    let indirim = 5
    if (toplamTutar > 500) indirim = 10
    if (toplamTutar > 1000) indirim = 15
    const turkceIsimler = ["Bahar", "Yaz", "Sonbahar", "Kış", "Fırsat", "İndirim", "Özel", "Süper", "Muhteşem", "Harika"]
    const rastgeleIsim = turkceIsimler[Math.floor(Math.random() * turkceIsimler.length)]
    const sonKullanmaTarihi = new Date()
    sonKullanmaTarihi.setDate(sonKullanmaTarihi.getDate() + 30)
    return {
      kod: `${rastgeleIsim.toUpperCase()}${Math.floor(Math.random() * 1000)}`,
      indirim: indirim,
      sonKullanmaTarihi: sonKullanmaTarihi.toLocaleDateString('tr-TR')
    }
  }

  const kuponDegisimi = (value: string) => {
    setSecimiKupon(value);
    const kupon = kuponlar.find(k => k.kod === value);
    setUygulanmisKupon(kupon || null);
    toplamHesapla(sepet, kupon);
  };

  const kuponGirisiIslemi = (e: React.FormEvent) => {
    e.preventDefault();
    const kupon = kuponlar.find(k => k.kod === kuponGirisi);
    if (kupon) {
      setUygulanmisKupon(kupon);
      toplamHesapla(sepet, kupon);
      bildirim({
        title: "Kupon Uygulandı",
        description: `${kupon.indirim}% indirim uygulandı.`,
      });
    } else {
      bildirim({
        title: "Geçersiz Kupon",
        description: "Girdiğiniz kupon kodu geçersiz.",
        variant: "destructive",
      });
    }
    setKuponGirisi("");
  };

  const yeniOdemeYontemiEkle = () => {
    const mevcutKullanici = JSON.parse(localStorage.getItem('mevcutKullanici') || 'null')
    if (mevcutKullanici) {
      let yeniYontem
      switch (yeniOdemeYontemi) {
        case 'credit_card':
          yeniYontem = { tur: 'Kredi Kartı', kartNumarasi, kartUzerindekiIsim, kartSonKullanmaTarihi, kartCVC }
          break
        case 'digital_wallet':
          yeniYontem = { tur: 'Dijital Cüzdan', isim: kartUzerindekiIsim }
          break
        case 'bank_transfer':
          yeniYontem = { tur: 'Banka Havalesi', bankaAdi, hesapNumarasi }
          break
        case 'cash_on_delivery':
          yeniYontem = { tur: 'Kapıda Ödeme' }
          break
        case 'crypto':
          yeniYontem = { tur: 'Kripto Para', adres: kriptoParaAdresi }
          break
        case 'sms':
          yeniYontem = { tur: 'SMS ile Ödeme', telefonNumarasi }
          break
        default:
          return
      }
      mevcutKullanici.odemeYontemleri = [...(mevcutKullanici.odemeYontemleri || []), yeniYontem]
      localStorage.setItem('mevcutKullanici', JSON.stringify(mevcutKullanici))
      setOdemeYontemleri([...odemeYontemleri, yeniYontem])
      bildirim({
        title: "Ödeme Yöntemi Eklendi",
        description: "Yeni ödeme yöntemi başarıyla eklendi.",
      })
    }
  }

  const girisUyarisiniGoster = () => {
    bildirim({
      title: "Giriş Yapmanız Gerekiyor",
      description: "Sepeti görüntülemek ve alışveriş yapmak için lütfen giriş yapın veya kayıt olun.",
      action: (
        <div className="flex space-x-2">
          <Button onClick={() => setGirisModaliAcik(true)}>Giriş Yap</Button>
          <Button onClick={() => setKayitModaliAcik(true)}>Kayıt Ol</Button>
        </div>
      ),
    })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adresGirisiRef.current && !adresGirisiRef.current.contains(event.target as Node)) {
        setOnerileriGoster(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const adresGirisiIslemi = (deger: string) => {
    setAdresGirisi(deger)
    const kucukHarfDeger = deger.toLowerCase()
    const filtrelenmis = onerilenAdresler.filter(adres => 
      adres.toLowerCase().includes(kucukHarfDeger) || 
      adres.toLowerCase().replace('i', 'ı').includes(kucukHarfDeger)
    )
    setFiltrelenmisAdresler(filtrelenmis)
  }

  const adresSecimi = (secilenAdres: string) => {
    setAdres(secilenAdres)
    setAdresGirisi(secilenAdres)
  }

  const miktarGuncelle = (index: number, yeniMiktar: number) => {
    if (yeniMiktar < 1) return;
    const yeniSepet = [...sepet];
    yeniSepet[index] = {
      ...yeniSepet[index],
      miktar: yeniMiktar,
      fiyat: typeof yeniSepet[index].fiyat === 'number' ? yeniSepet[index].fiyat : 0
    };
    setSepet(yeniSepet);
    localStorage.setItem('sepet', JSON.stringify(yeniSepet));
    toplamHesapla(yeniSepet, uygulanmisKupon);
  };


  return (
    <KimlikKorumasi>
      <div className="container mx-auto px-4 py-8 bg-background">
        <h1 className="text-3xl font-bold mb-8 text-primary">Alışveriş Sepeti</h1>
        <div className="flex flex-wrap justify-between mb-8">
          {adimlar.map((adim, index) => (
            <div
              key={adim}
              className={`flex items-center ${
                index <= suankiAdim ? "text-primary" : "text-muted-foreground"
              } mb-2 sm:mb-0`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  index <= suankiAdim ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-muted"
                }`}
              >
                {index + 1}
              </div>
              {adim}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={suankiAdim}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {suankiAdim === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {sepet.map((urun, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center space-x-4 mb-4 bg-card p-4 rounded-lg shadow-md"
                    >
                      <Image src={urun.resim || '/placeholder.svg'} alt={urun.ad || 'Ürün'} width={100} height={100} className="rounded-md" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-card-foreground">{urun.ad || 'İsimsiz Ürün'}</h3>
                        <p className="text-sm text-muted-foreground">{urun.marka || 'Marka Belirtilmemiş'}</p>
                        <p className="text-sm font-bold text-primary">{typeof urun.fiyat === 'number' ? urun.fiyat.toFixed(2) : '0.00'} TL</p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => miktarGuncelle(index, (urun.miktar || 1) - 1)}
                            disabled={(urun.miktar || 1) <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-2">{urun.miktar || 1}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => miktarGuncelle(index, (urun.miktar || 1) + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <GradyanButon onClick={() => sepettenKaldir(index)}>Kaldır</GradyanButon>
                    </motion.div>
                  ))}
                  <div className="mt-4 space-y-2">
                    <p className="font-bold text-xl text-primary">Ara Toplam: {aratoplam.toFixed(2)} TL</p>
                    {uygulanmisKupon && (
                      <p className="text-white font-semibold py-2 px-4 rounded-md bg-gradient-to-r from-purple-600 to-pink-600">
                        İndirim: {((aratoplam * (uygulanmisKupon.indirim || 0)) / 100).toFixed(2)} TL ({uygulanmisKupon.indirim || 0}%)
                      </p>
                    )}
                    <p>KDV (%{(KDV_ORANI * 100).toFixed(0)}): {(aratoplam * KDV_ORANI).toFixed(2)} TL</p>
                    <p>Kargo Ücreti: {KARGO_UCRETI.toFixed(2)} TL</p>
                    <p className="font-bold text-xl text-primary">Toplam: {toplam.toFixed(2)} TL</p>
                  </div>
                  {kuponlar.length > 0 && (
                    <div className="mt-4">
                      <Select onValueChange={kuponDegisimi}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kupon Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {kuponlar.map((kupon, index) => (
                            <SelectItem key={index} value={kupon.kod}>
                              {kupon.kod} - {kupon.indirim}% indirim
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <form onSubmit={kuponGirisiIslemi} className="mt-4 flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Kupon Kodu Girin"
                      value={kuponGirisi}
                      onChange={(e) => setKuponGirisi(e.target.value)}
                    />
                    <Button type="submit">Uygula</Button>
                  </form>
                </div>
              </div>
            )}
            {suankiAdim === 1 && (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-primary">Teslimat Bilgileri</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput
                        placeholder="Adres ara..."
                        value={adresGirisi}
                        onValueChange={adresGirisiIslemi}
                      />
                      <CommandList>
                        <CommandEmpty>Adres bulunamadı.</CommandEmpty>
                        <CommandGroup heading="Önerilen Adresler">
                          {filtrelenmisAdresler.map((adres) => (
                            <CommandItem
                              key={adres}
                              onSelect={() => adresSecimi(adres)}
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
                </div>
              </div>
            )}
            {suankiAdim === 2 && (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-primary">Ödeme Bilgileri</h2>
                {odemeYontemleri.length > 0 ? (
                  <form onSubmit={odemeyiYap} className="space-y-4">
                    <Select onValueChange={setSecimiOdemeYontemi}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ödeme Yöntemi Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {odemeYontemleri.map((yontem, index) => (
                          <SelectItem key={index} value={yontem.tur}>
                            <div className="flex items-center">
                              {yontem.tur === 'Kredi Kartı' && <CreditCard className="mr-2" size={16} />}
                              {yontem.tur === 'Dijital Cüzdan' && <Wallet className="mr-2" size={16} />}
                              {yontem.tur === 'Banka Havalesi' && <Bank className="mr-2" size={16} />}
                              {yontem.tur === 'Kapıda Ödeme' && <Truck className="mr-2" size={16} />}
                              {yontem.tur === 'Kripto Para' && <Bitcoin className="mr-2" size={16} />}
                              {yontem.tur === 'SMS ile Ödeme' && <Smartphone className="mr-2" size={16} />}
                              {yontem.tur} 
                              {yontem.kartNumarasi && ` - **** ${yontem.kartNumarasi.slice(-4)}`}
                              {yontem.isim && ` - ${yontem.isim}`}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {odemeIsleniyor ? 'İşleniyor...' : 'Ödeme Yap'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <p>Henüz bir ödeme yöntemi eklenmemiş. Lütfen yeni bir ödeme yöntemi ekleyin.</p>
                    <Select onValueChange={setYeniOdemeYontemi}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ödeme Yöntemi Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Kredi ve Banka Kartları</SelectItem>
                        <SelectItem value="digital_wallet">Dijital Cüzdanlar</SelectItem>
                        <SelectItem value="bank_transfer">Banka Havalesi / EFT</SelectItem>
                        <SelectItem value="cash_on_delivery">Kapıda Ödeme</SelectItem>
                        <SelectItem value="crypto">Kripto Para</SelectItem>
                        <SelectItem value="sms">SMS ile Ödeme</SelectItem>
                      </SelectContent>
                    </Select>
                    {yeniOdemeYontemi === 'credit_card' && (
                      <>
                        <Input placeholder="Kart Numarası" value={kartNumarasi} onChange={(e) => setKartNumarasi(e.target.value)} />
                        <Input placeholder="Kart Üzerindeki İsim" value={kartUzerindekiIsim} onChange={(e) => setKartUzerindekiIsim(e.target.value)} />
                        <Input placeholder="Son Kullanma Tarihi" value={kartSonKullanmaTarihi} onChange={(e) => setKartSonKullanmaTarihi(e.target.value)} />
                        <Input placeholder="CVC" value={kartCVC} onChange={(e) => setKartCVC(e.target.value)} />
                      </>
                    )}
                    {yeniOdemeYontemi === 'digital_wallet' && (
                      <Input placeholder="Dijital Cüzdan Adı" value={kartUzerindekiIsim} onChange={(e) => setKartUzerindekiIsim(e.target.value)} />
                    )}
                    {yeniOdemeYontemi === 'bank_transfer' && (
                      <>
                        <Input placeholder="Banka Adı" value={bankaAdi} onChange={(e) => setBankaAdi(e.target.value)} />
                        <Input placeholder="Hesap Numarası" value={hesapNumarasi} onChange={(e) => setHesapNumarasi(e.target.value)} />
                      </>
                    )}
                    {yeniOdemeYontemi === 'crypto' && (
                      <Input placeholder="Kripto Para Adresi" value={kriptoParaAdresi} onChange={(e) => setKriptoParaAdresi(e.target.value)} />
                    )}
                    {yeniOdemeYontemi === 'sms' && (
                      <Input placeholder="Telefon Numarası" value={telefonNumarasi} onChange={(e) => setTelefonNumarasi(e.target.value)} />
                    )}
                    <Button onClick={yeniOdemeYontemiEkle} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Ödeme Yöntemi Ekle
                    </Button>
                  </div>
                )}
              </div>
            )}
            {suankiAdim === 3 && (
              <div className="max-w-md mx-auto text-center">
                {odemeIsleniyor ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 mx-auto mb-4"
                  >
                    <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-4">
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-full h-full"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      >
                        <motion.circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="url(#gradient)"
                                                  strokeWidth="2"
                          fill="none"
                        />
                        <motion.path
                          d="M8 12l2 2 4-4"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9333ea" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-primary">Siparişiniz Alındı</h2>
                    <p className="text-muted-foreground mb-4">Teşekkür ederiz! Siparişiniz başarıyla tamamlandı.</p>
                    <Button
                      onClick={() => router.push(`/siparisler/${siparisNo}`)}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      Siparişinizi İnceleyin
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          {suankiAdim > 0 && (
            <GradyanButon onClick={oncekiAdimaDon}>Geri</GradyanButon>
          )}
          {suankiAdim < adimlar.length - 1 && (
            <GradyanButon onClick={sonrakiAdimaGeç}>İleri</GradyanButon>
          )}
        </div>
        <GirisModal acikMi={girisModaliAcik} kapat={() => setGirisModaliAcik(false)} />
        <KayitModal acikMi={kayitModaliAcik} kapat={() => setKayitModaliAcik(false)} />
      </div>
    </KimlikKorumasi>
  )
}

