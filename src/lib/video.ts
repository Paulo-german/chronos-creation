/**
 * Converte uma URL de vídeo (YouTube, Vimeo, Instagram) na URL de embed
 * usada no <iframe> do modal. Retorna null se não houver URL.
 * Se o formato não for reconhecido, devolve a própria URL como fallback.
 */
export function videoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // YouTube: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, /shorts/ID
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`

  // Vimeo: vimeo.com/ID ou vimeo.com/video/ID
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`

  // Instagram: /p/, /reel/ ou /tv/
  const ig = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/)
  if (ig) return `https://www.instagram.com/p/${ig[1]}/embed`

  return url
}

/**
 * Devolve uma thumbnail para a URL de vídeo.
 * YouTube tem thumbnail pública por ID; Vimeo exige API, então retorna null
 * (cai no cover do case / placeholder).
 */
export function videoThumb(url: string | null | undefined): string | null {
  if (!url) return null
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`
  return null
}
