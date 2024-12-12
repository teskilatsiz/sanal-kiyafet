import { UrunDenemeIstemcisi } from '@/components/urun-deneme-istemcisi'

export default function UrunDenemeSayfasi({ params }: { params: { id: string } }) {
 return <UrunDenemeIstemcisi id={params.id} />
}

