import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

// Reader local: lê os arquivos de conteúdo no build/prerender.
export const reader = createReader(process.cwd(), keystaticConfig)

/**
 * Normaliza o valor de um campo de imagem do Keystatic em URL pública.
 * O reader devolve o nome do arquivo cru (ex.: "logo.png"); aqui garantimos
 * o prefixo do publicPath para funcionar em qualquer rota.
 */
export function assetUrl(
  value: string | null | undefined,
  publicPath = '/',
): string | null {
  if (!value) return null
  if (value.startsWith('/') || value.startsWith('http')) return value
  return publicPath.endsWith('/') ? publicPath + value : publicPath + '/' + value
}
