import { createClient, type SanityClient } from '@sanity/client'

let _writeClient: SanityClient | null = null

export function getSanityWriteClient(): SanityClient {
  if (!_writeClient) {
    _writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    })
  }
  return _writeClient
}
