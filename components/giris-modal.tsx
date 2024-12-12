"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBildirim } from "@/components/ui/bildirim"
import { MessageSquare, Mail } from 'lucide-react'
import { FaApple } from 'react-icons/fa'
import { useBildirim as useToast } from "@/components/ui/bildirim"

interface GirisModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function GirisModal({ isOpen, onClose, onSuccess }: GirisModalProps) {
  const [kullaniciAdi, setKullaniciAdi] = useState("")
  const [sifre, setSifre] = useState("")
  const [hata, setHata] = useState("")
  const { bildirim } = useToast()
  const [smsIleGirisGoster, setSmsIleGirisGoster] = useState(false)
  const [telefonNumarasi, setTelefonNumarasi] = useState("")
  const { bildirim: bildirim2 } = useBildirim()

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (!users.some((u: any) => u.username === 'teskilatsiz')) {
      const newUser = {
        username: 'teskilatsiz',
        password: '123456',
        email: 'teskilatsiz@example.com',
        coupons: [
          {
            code: 'HOSGELDIN10',
            discount: 10,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            code: 'KISLIK20',
            discount: 20,
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        ]
      }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
    }
  }, [])

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.username === kullaniciAdi && u.password === sifre)
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      onSuccess()
      onClose()
      bildirim({
        title: "Başarılı Giriş",
        description: "Hoş geldiniz, " + kullaniciAdi + "!",
      })
    } else {
      setHata("Kullanıcı adı veya şifre hatalı")
    }
  }

  const hizliGirisYap = (yontem: string) => {
    if (yontem === 'SMS') {
      setSmsIleGirisGoster(true)
    } else {
      bildirim({
        title: "Özellik Henüz Mevcut Değil",
        description: `${yontem.toUpperCase()} ile giriş şu anda mevcut değil.`,
        variant: "destructive",
      })
    }
  }

  const smsIleGirisYap = (e: React.FormEvent) => {
    e.preventDefault()
    const demoUser = {
      username: 'sms_user',
      phone: telefonNumarasi,
    }
    localStorage.setItem('currentUser', JSON.stringify(demoUser))
    onSuccess()
    onClose()
    bildirim({
      title: "SMS ile Giriş Başarılı",
      description: `${telefonNumarasi} numarası ile giriş yapıldı.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Giriş Yap</DialogTitle>
        </DialogHeader>
        {smsIleGirisGoster ? (
          <form onSubmit={smsIleGirisYap} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Telefon Numarası</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={telefonNumarasi}
                onChange={(e) => setTelefonNumarasi(e.target.value)}
                required
                className="w-full py-2 bg-background text-foreground"
                placeholder="05XX XXX XX XX"
              />
            </div>
            <Button type="submit" className="w-full py-2 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:scale-105">SMS ile Giriş Yap</Button>
            <Button type="button" variant="outline" onClick={() => setSmsIleGirisGoster(false)} className="w-full">
              Geri
            </Button>
          </form>
        ) : (
          <form onSubmit={girisYap} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                required
                className="w-full py-2 bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                required
                className="w-full py-2 bg-background text-foreground"
              />
            </div>
            {hata && <p className="text-pink-600 font-semibold">{hata}</p>}
            <Button type="submit" className="w-full py-2 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:scale-105">Giriş Yap</Button>
            <div className="mt-4">
              <p className="text-sm text-center mb-2">Veya hızlı giriş yapın:</p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => hizliGirisYap('SMS')} variant="outline" className="w-full bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS ile Giriş
                </Button>
                <Button onClick={() => hizliGirisYap('Google')} variant="outline" className="w-full bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Google ile Giriş
                </Button>
                <Button onClick={() => hizliGirisYap('Apple')} variant="outline" className="w-full bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors">
                  <FaApple className="w-4 h-4 mr-2" />
                  Apple ile Giriş
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

