"use client"

import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function TarihSecici() {
  const [tarih, setTarih] = useState('')

  const tarihFormatla = (tarihDizesi: string) => {
    if (!tarihDizesi) return ''
    const [yil, ay, gun] = tarihDizesi.split('-')
    return `${gun}/${ay}/${yil}`
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tarih">Tarih Seçin</Label>
      <Input
        type="date"
        id="tarih"
        value={tarih}
        onChange={(e) => setTarih(e.target.value)}
        className="w-full"
      />
      {tarih && (
        <p className="text-sm text-muted-foreground">
          Seçilen tarih: {tarihFormatla(tarih)}
        </p>
      )}
    </div>
  )
}

