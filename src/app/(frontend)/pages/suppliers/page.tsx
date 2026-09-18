import type { Metadata } from 'next'
import SupplierPageContent from '@/components/pages/suppliers/SupplierPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getSuppliersPageContent } from '@/lib/suppliers/getSuppliersPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildSuppliersPageJsonLd } from '@/lib/seo/suppliersSchema'

/** Soft ISR fallback. Payload Suppliers saves also call revalidatePath('/suppliers'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSuppliersPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/suppliers',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/supplier-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function SuppliersPage() {
  const content = await getSuppliersPageContent()
  const suppliersJsonLd = buildSuppliersPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="suppliers" seo={content.seo} defaultJsonLd={suppliersJsonLd} />
      <SupplierPageContent content={content} />
    </>
  )
}
