"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBildirim } from "@/components/ui/bildirim"
import { useBildirim as useToast } from "@/components/ui/bildirim"
import { MessageSquare, Mail } from 'lucide-react'
import { FaApple } from 'react-icons/fa'

interface KayitModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function KayitModal({ isOpen, onClose, onSuccess }: KayitModalProps) {
  const [kullaniciAdi, setKullaniciAdi] = useState("")
  const [eposta, setEposta] = useState("")
  const [sifre, setSifre] = useState("")
  const [hata, setHata] = useState("")
  const [smsIleKayitGoster, setSmsIleKayitGoster] = useState(false)
  const [telefonNumarasi, setTelefonNumarasi] = useState("")
  const { bildirim } = useToast()
  const { bildirim: bildirim2 } = useBildirim()

  const kayitOl = (e: React.FormEvent) => {
    e.preventDefault()
    setHata("")

    const kullanicilar = JSON.parse(localStorage.getItem('users') || '[]')
    if (kullanicilar.some((u: any) => u.username === kullaniciAdi)) {
      setHata("Bu kullanıcı adı zaten kullanılıyor")
      return
    }

    const yeniKullanici = {
      username: kullaniciAdi,
      email: eposta,
      password: sifre,
    }
    kullanicilar.push(yeniKullanici)
    localStorage.setItem('users', JSON.stringify(kullanicilar))
    localStorage.setItem('currentUser', JSON.stringify(yeniKullanici))

    onSuccess()
    onClose()
    bildirim({
      title: "Kayıt Başarılı",
      description: "Hesabınız başarıyla oluşturuldu!",
    })
  }

  const hizliKayitOl = (yontem: string) => {
    if (yontem === 'SMS') {
      setSmsIleKayitGoster(true)
    } else {
      bildirim({
        title: "Özellik Henüz Mevcut Değil",
        description: `${yontem.toUpperCase()} ile kayıt şu anda mevcut değil.`,
        variant: "destructive",
      })
    }
  }

  const smsIleKayitOl = (e: React.FormEvent) => {
    e.preventDefault()
    
    const yeniKullanici = {
      username: `sms_user_${Date.now()}`,
      phone: telefonNumarasi,
    }
    const kullanicilar = JSON.parse(localStorage.getItem('users') || '[]')
    kullanicilar.push(yeniKullanici)
    localStorage.setItem('users', JSON.stringify(kullanicilar))
    localStorage.setItem('currentUser', JSON.stringify(yeniKullanici))
    onSuccess()
    onClose()
    bildirim({
      title: "SMS ile Kayıt Başarılı",
      description: `${telefonNumarasi} numarası ile kayıt yapıldı.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Kayıt Ol</DialogTitle>
        </DialogHeader>
        {smsIleKayitGoster ? (
          <form onSubmit={smsIleKayitOl} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Telefon Numarası</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={telefonNumarasi}
                onChange={(e) => setTelefonNumarasi(e.target.value)}
                required
                className="w-full py-2"
                placeholder="05XX XXX XX XX"
              />
            </div>
            <Button type="submit" className="w-full py-2 text-lg font-semibold">SMS ile Kayıt Ol</Button>
            <Button type="button" variant="outline" onClick={() => setSmsIleKayitGoster(false)} className="w-full">
              Geri
            </Button>
          </form>
        ) : (
          <>
            <form onSubmit={kayitOl} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kullaniciAdi">Kullanıcı Adı</Label>
                <Input
                  id="kullaniciAdi"
                  value={kullaniciAdi}
                  onChange={(e) => setKullaniciAdi(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eposta">E-posta</Label>
                <Input
                  id="eposta"
                  type="email"
                  value={eposta}
                  onChange={(e) => setEposta(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sifre">Şifre</Label>
                <Input
                  id="sifre"
                  type="password"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  required
                />
              </div>
              {hata && <p className="text-red-500 text-sm">{hata}</p>}
              <Button type="submit" className="w-full py-2 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:scale-105">Kayıt Ol</Button>
            </form>
            <div className="mt-4">
              <p className="text-sm text-center mb-2">Veya hızlı kayıt olun:</p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => hizliKayitOl('SMS')} variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS ile Kayıt
                </Button>
                <Button onClick={() => hizliKayitOl('Google')} variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Google ile Kayıt
                </Button>
                <Button onClick={() => hizliKayitOl('Apple')} variant="outline" className="w-full">
                  <FaApple className="w-4 h-4 mr-2" />
                  Apple ile Kayıt
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

