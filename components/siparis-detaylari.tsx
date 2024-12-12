"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Package, TruckIcon, MapPin, CheckCircle } from 'lucide-react'
import { bildirim } from "@/components/ui/bildirim"

interface SiparisDetaylariProps {
  siparisId: string
}

export default function SiparisDetaylari({ siparisId }: SiparisDetaylariProps) {
  const [siparis, setSiparis] = useState<any>(null)
  const router = useRouter()
  const { toast } = bildirim()

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find((order: any) => order.id === siparisId)
    if (foundOrder) {
      setSiparis(foundOrder)
    } else {
      router.push('/profil')
    }
  }, [siparisId, router])

  if (!siparis) {
    return <div className="container mx-auto px-4 py-8">Sipariş yükleniyor...</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hazırlanıyor':
        return <Package className="w-6 h-6 text-purple-600" />
      case 'Yola Çıktı':
        return <TruckIcon className="w-6 h-6 text-pink-600" />
      case 'Dağıtımda':
        return <MapPin className="w-6 h-6 text-purple-600" />
      case 'Teslim Edildi':
        return <CheckCircle className="w-6 h-6 text-pink-600" />
      default:
        return null
    }
  }

  const formatPrice = (price: number | undefined) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00'
  }

  const handleCancelOrder = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = orders.filter((order: any) => order.id !== siparisId)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    bildirim({
      title: "Sipariş İptal Edildi",
      description: "Siparişiniz başarıyla iptal edildi.",
      duration: 3000,
    })
    router.push('/profil')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sipariş Detayları</CardTitle>
          <CardDescription>Sipariş No: {siparis.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Durum:</span>
            <div className="flex items-center">
              {getStatusIcon(siparis.status || '')}
              <span className="ml-2">{siparis.status || 'Bilinmiyor'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Tarih:</span>
            <span>{siparis.date ? new Date(siparis.date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Toplam Tutar:</span>
            <span>{formatPrice(siparis.total)} TL</span>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Ürünler</h3>
            {siparis.items && siparis.items.length > 0 ? (
              siparis.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <Image src={item.resim || '/placeholder.svg'} alt={item.ad || 'Ürün'} width={50} height={50} className="rounded-md" />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.ad || 'İsimsiz Ürün'}</p>
                    <p className="text-sm text-gray-600">Adet: {item.miktar || 0}</p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.fiyat ? item.fiyat * (item.miktar || 1) : undefined)} TL
                  </p>
                </div>
              ))
            ) : (
              <p>Ürün bilgisi bulunamadı.</p>
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Teslimat Bilgileri</h3>
            <p>{siparis.deliveryAddress || 'Adres belirtilmemiş'}</p>
            <p className="mt-2">Teslimat Yöntemi: {siparis.deliveryMethod || 'Belirtilmemiş'}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Ödeme Bilgileri</h3>
            <p>Ödeme Yöntemi: {siparis.paymentMethod || 'Belirtilmemiş'}</p>
            <p className="mt-2">Ödeme Detayları: {siparis.paymentDetails || 'Belirtilmemiş'}</p>
          </div>
          {siparis.appliedCoupon && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Uygulanan Kupon</h3>
              <p>Kod: {siparis.appliedCoupon.code || 'Belirtilmemiş'}</p>
              <p>İndirim: %{siparis.appliedCoupon.discount || 0}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push('/profil')} variant="outline">Profil'e Dön</Button>
          <Button 
            onClick={handleCancelOrder} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Siparişi İptal Et
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

