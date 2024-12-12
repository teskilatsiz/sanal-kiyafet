import SiparisDetaylari from '@/components/siparis-detaylari'

export default function SiparisSayfasi({ params }: { params: { siparisId: string } }) {
 return <SiparisDetaylari siparisId={params.siparisId} />
}

