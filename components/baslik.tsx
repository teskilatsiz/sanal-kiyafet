"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, ShoppingCart, User, LogIn, UserPlus, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { GirisModal } from "@/components/giris-modal"
import { KayitModal } from "@/components/kayit-modal"
import { AnimasyonluLogo } from "@/components/animasyonlu-logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBildirim } from "@/components/ui/bildirim"
import { useRouter } from 'next/navigation'
import { useBildirim as useBildirim2 } from "@/components/ui/bildirim"

export function Baslik() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isGirisModalOpen, setIsGirisModalOpen] = useState(false)
  const [isKayitModalAcik, setIsKayitModalAcik] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const { bildirim } = useBildirim()
  const router = useRouter()
  const { bildirim: bildirim2 } = useBildirim2()

  useEffect(() => {
    setMounted(true)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    setIsLoggedIn(!!currentUser)

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItemCount(cart.length)
    const savedTheme = localStorage.getItem('sanal-kiyafet-theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('sanal-kiyafet-theme', newTheme)
    bildirim({
      title: "Tema degistirildi",
      description: `Tema ${newTheme === 'dark' ? 'karanlik' : 'aydinlik'} olarak ayarlandi.`,
      duration: 2000,
    })
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <AnimasyonluLogo />
            <span className="sr-only">Sanal Kiyafet</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Button variant="ghost" onClick={() => handleNavigation('/yukle')}>
            Modelinizi Yükleyin
          </Button>
          <Button variant="ghost" onClick={() => handleNavigation('/urunler')}>
            Ürünler
          </Button>
          <Button variant="ghost" onClick={() => handleNavigation('/ornekler')}>
            Örnek Modeller
          </Button>
        </nav>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:inline-flex bg-background text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Tema degistir</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleNavigation('/sepet')} className="relative bg-background text-foreground">
            <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Sepet</span>
          </Button>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-background text-foreground">
                  <User className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleNavigation('/profil')}>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Çıkış</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsGirisModalOpen(true)} className="hidden md:inline-flex">
                <LogIn className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Giris</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsKayitModalAcik(true)} className="hidden md:inline-flex">
                <UserPlus className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Kayit</span>
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleNavigation('/yukle')}>
                Modelini Yükle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/urunler')}>
                Ürünler
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/ornekler')}>
                Örnek Modeller
              </DropdownMenuItem>
              {!isLoggedIn && (
                <>
                  <DropdownMenuItem onClick={() => setIsGirisModalOpen(true)}>
                    Giriş
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsKayitModalAcik(true)}>
                    Kayıt
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                Tema Değiştir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <GirisModal 
        isOpen={isGirisModalOpen} 
        onClose={() => setIsGirisModalOpen(false)} 
        onSuccess={() => {
          setIsLoggedIn(true)
          setIsGirisModalOpen(false)
        }} 
      />
      <KayitModal 
        isOpen={isKayitModalAcik} 
        onClose={() => setIsKayitModalAcik(false)}
        onSuccess={() => {
          setIsLoggedIn(true)
          setIsKayitModalAcik(false)
        }}
      />
    </header>
  )
}

