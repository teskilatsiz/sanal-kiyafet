import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimasyonluIllustrasyon } from '@/components/animasyonlu-illustrasyon'

export default function AnaSayfa() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-background overflow-hidden">
      <main className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Sanal Kıyafet
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Kendi fotoğrafında veya örnek modellerde kıyafetleri dene!
        </p>
        <AnimasyonluIllustrasyon />
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Button asChild>
            <Link href="/yukle">Fotoğraf Yükle</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/ornekler">Örnek Modeller</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

// SSG için
export async function generateStaticParams() {
  return []
}

