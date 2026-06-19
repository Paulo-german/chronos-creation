import { config, collection, singleton, fields } from '@keystatic/core'

// ─────────────────────────────────────────────────────────────
// Keystatic — painel de gerenciamento do site CHRONOS Creation
// Storage `local` durante o desenvolvimento. No deploy (Vercel),
// trocar para { kind: 'cloud' } + cloud: { project: '...' }.
// ─────────────────────────────────────────────────────────────

const iconOptions = [
  { label: 'Filme (audiovisual)', value: 'film' },
  { label: 'Compartilhar (redes)', value: 'share2' },
  { label: 'Crescimento (marketing)', value: 'trending-up' },
  { label: 'Brilho (branding)', value: 'sparkles' },
  { label: 'Globo (websites)', value: 'globe' },
  { label: 'Câmera (fotografia)', value: 'camera' },
] as const

const categoryOptions = [
  { label: 'Audiovisual', value: 'Audiovisual' },
  { label: 'Branding', value: 'Branding' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Redes Sociais', value: 'Redes Sociais' },
  { label: 'Fotografia', value: 'Fotografia' },
  { label: 'Websites', value: 'Websites' },
] as const

// Tamanho do bloco no mosaico (bento) da home.
const gridOptions = [
  { label: 'Destaque grande (2x2)', value: 'sm:col-span-2 sm:row-span-2' },
  { label: 'Largo (2 colunas)', value: 'sm:col-span-2' },
  { label: 'Padrão (1 coluna)', value: '' },
] as const

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'CHRONOS Creation' },
    navigation: {
      Conteúdo: ['projects', 'cases', 'social', 'testimonials', 'services', 'processSteps'],
      Páginas: ['home', 'servicePages', 'marketingGallery'],
      Configurações: ['contact', 'settings'],
    },
  },

  collections: {
    // ── Portfólio ───────────────────────────────────────────
    projects: collection({
      label: 'Portfólio',
      path: 'src/content/projects/*',
      slugField: 'title',
      format: { data: 'json' },
      columns: ['title', 'category'],
      schema: {
        title: fields.slug({
          name: { label: 'Nome do projeto', validation: { isRequired: true } },
        }),
        client: fields.text({ label: 'Cliente', description: 'Nome do cliente/marca atendida.' }),
        category: fields.select({
          label: 'Categoria',
          description: 'Define o filtro na página de projetos.',
          options: categoryOptions,
          defaultValue: 'Audiovisual',
        }),
        cover: fields.image({
          label: 'Capa (imagem ou thumbnail do vídeo)',
          directory: 'public/portfolio',
          publicPath: '/portfolio/',
        }),
        videoUrl: fields.url({
          label: 'Link do vídeo',
          description: 'Cole a URL do YouTube, Vimeo ou Instagram. O vídeo abre num modal ao clicar.',
        }),
        description: fields.text({ label: 'Descrição', multiline: true }),
        year: fields.text({ label: 'Ano', description: 'Ex.: 2025' }),
        gridClass: fields.select({
          label: 'Tamanho no mosaico da home',
          description: 'Define o tamanho do bloco no grid da página inicial.',
          options: gridOptions,
          defaultValue: '',
        }),
        minHeight: fields.text({
          label: 'Altura mínima na home (opcional)',
          description: 'Ex.: min-h-[200px] ou sm:min-h-[420px]. Deixe vazio se não souber.',
        }),
        order: fields.integer({ label: 'Ordem de exibição', defaultValue: 1 }),
      },
    }),

    // ── Cases (galeria por serviço: branding, fotografia…) ──
    cases: collection({
      label: 'Cases',
      path: 'src/content/cases/*',
      slugField: 'title',
      format: { data: 'json' },
      columns: ['title', 'service', 'client'],
      schema: {
        title: fields.slug({
          name: { label: 'Nome do case', validation: { isRequired: true } },
        }),
        client: fields.text({ label: 'Cliente' }),
        segment: fields.text({ label: 'Segmento', description: 'Ex.: Gastronomia, Estética, Hotelaria' }),
        service: fields.select({
          label: 'Serviço',
          description: 'Em qual página de serviço este case aparece.',
          options: categoryOptions,
          defaultValue: 'Branding',
        }),
        cover: fields.image({
          label: 'Capa',
          directory: 'public/portfolio/cases',
          publicPath: '/portfolio/cases/',
        }),
        description: fields.text({ label: 'Descrição', multiline: true }),
        gallery: fields.array(
          fields.image({
            label: 'Imagem',
            directory: 'public/portfolio/cases',
            publicPath: '/portfolio/cases/',
          }),
          { label: 'Imagens do case', itemLabel: (p) => p.value?.split('/').pop() || 'Imagem' },
        ),
        videos: fields.array(
          fields.object({
            title: fields.text({ label: 'Título do vídeo' }),
            url: fields.url({ label: 'Link (YouTube ou Vimeo)' }),
          }),
          {
            label: 'Vídeos (cases de audiovisual)',
            description: 'Cole o link do YouTube/Vimeo de cada vídeo.',
            itemLabel: (p) => p.fields.title.value || 'Vídeo',
          },
        ),
        order: fields.integer({ label: 'Ordem de exibição', defaultValue: 1 }),
      },
    }),

    // ── Redes sociais (feed por conta: posts img + reels) ───
    social: collection({
      label: 'Redes sociais',
      path: 'src/content/social/*',
      slugField: 'title',
      format: { data: 'json' },
      columns: ['title', 'segment'],
      schema: {
        title: fields.slug({
          name: { label: 'Nome da conta', validation: { isRequired: true } },
        }),
        client: fields.text({ label: 'Cliente' }),
        segment: fields.text({ label: 'Segmento', description: 'Ex.: Odontologia, Imóveis, Gastronomia' }),
        handle: fields.text({ label: 'Arroba (@)', description: 'Ex.: @cliente' }),
        cover: fields.image({
          label: 'Capa / avatar',
          directory: 'public/portfolio/social',
          publicPath: '/portfolio/social/',
        }),
        order: fields.integer({ label: 'Ordem de exibição', defaultValue: 1 }),
        posts: fields.array(
          fields.object({
            type: fields.select({
              label: 'Tipo',
              options: [
                { label: 'Imagem', value: 'image' },
                { label: 'Vídeo (reel)', value: 'video' },
              ],
              defaultValue: 'image',
            }),
            image: fields.image({
              label: 'Imagem',
              directory: 'public/portfolio/social',
              publicPath: '/portfolio/social/',
            }),
            video: fields.file({
              label: 'Vídeo',
              directory: 'public/portfolio/social',
              publicPath: '/portfolio/social/',
            }),
            poster: fields.image({
              label: 'Capa do vídeo',
              directory: 'public/portfolio/social',
              publicPath: '/portfolio/social/',
            }),
          }),
          {
            label: 'Posts',
            itemLabel: (p) =>
              (p.fields.type.value === 'video' ? 'Vídeo' : 'Imagem') +
              ' — ' +
              ((p.fields.image.value || p.fields.video.value || '')
                .toString()
                .split('/')
                .pop() || 'post'),
          },
        ),
      },
    }),

    // ── Depoimentos (home) ──────────────────────────────────
    testimonials: collection({
      label: 'Depoimentos',
      path: 'src/content/testimonials/*',
      slugField: 'author',
      format: { data: 'json' },
      columns: ['author', 'company'],
      schema: {
        author: fields.slug({
          name: { label: 'Autor', validation: { isRequired: true } },
        }),
        company: fields.text({ label: 'Empresa / cargo' }),
        rating: fields.integer({ label: 'Nota (estrelas)', defaultValue: 5 }),
        quote: fields.text({ label: 'Depoimento (texto)', multiline: true }),
        video: fields.file({
          label: 'Vídeo (opcional)',
          description: 'Se preenchido, vira um depoimento em vídeo em vez de texto.',
          directory: 'public/portfolio/testimonials',
          publicPath: '/portfolio/testimonials/',
        }),
        poster: fields.image({
          label: 'Capa do vídeo',
          directory: 'public/portfolio/testimonials',
          publicPath: '/portfolio/testimonials/',
        }),
        order: fields.integer({ label: 'Ordem de exibição', defaultValue: 1 }),
      },
    }),

    // ── Serviços (cards da home) ────────────────────────────
    services: collection({
      label: 'Serviços',
      path: 'src/content/services/*',
      slugField: 'title',
      format: { data: 'json' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: { label: 'Título', validation: { isRequired: true } },
        }),
        href: fields.text({
          label: 'Link da página',
          description: 'Ex.: /audiovisual',
          validation: { isRequired: true },
        }),
        tags: fields.text({ label: 'Tags', description: 'Separadas por · (ponto médio)' }),
        description: fields.text({ label: 'Descrição', multiline: true }),
        linkLabel: fields.text({ label: 'Texto do link', defaultValue: 'Conhecer a solução' }),
        icon: fields.select({ label: 'Ícone', options: iconOptions, defaultValue: 'sparkles' }),
        order: fields.integer({ label: 'Ordem', defaultValue: 1 }),
      },
    }),

    // ── Etapas do processo ──────────────────────────────────
    processSteps: collection({
      label: 'Processo',
      path: 'src/content/process/*',
      slugField: 'title',
      format: { data: 'json' },
      columns: ['number', 'title'],
      schema: {
        number: fields.text({ label: 'Número', description: 'Ex.: 01' }),
        title: fields.slug({ name: { label: 'Título', validation: { isRequired: true } } }),
        description: fields.text({ label: 'Descrição', multiline: true }),
      },
    }),

    // ── Páginas de serviço (audiovisual, branding, etc.) ────
    servicePages: collection({
      label: 'Páginas de serviço',
      path: 'src/content/service-pages/*',
      slugField: 'eyebrow',
      format: { data: 'json' },
      columns: ['eyebrow'],
      schema: {
        eyebrow: fields.slug({
          name: { label: 'Nome (eyebrow)', validation: { isRequired: true } },
          description: 'O slug define a URL da página. Ex.: "Audiovisual" → deve casar com a rota.',
        }),
        seoTitle: fields.text({ label: 'Título SEO (aba do navegador)' }),
        description: fields.text({ label: 'Meta descrição (SEO)', multiline: true }),
        heroTitle: fields.text({ label: 'Título do topo', multiline: true }),
        heroSubtitle: fields.text({ label: 'Subtítulo do topo', multiline: true }),
        whatTitle: fields.text({ label: 'Título da seção "O que é"' }),
        whatBody: fields.array(fields.text({ label: 'Parágrafo', multiline: true }), {
          label: 'Parágrafos explicativos',
          itemLabel: (p) => p.value?.slice(0, 40) || 'Parágrafo',
        }),
        deliverables: fields.array(fields.text({ label: 'Item' }), {
          label: 'Entregas',
          itemLabel: (p) => p.value || 'Item',
        }),
        forWhom: fields.array(fields.text({ label: 'Item' }), {
          label: 'Para quem é',
          itemLabel: (p) => p.value || 'Item',
        }),
      },
    }),
  },

  singletons: {
    // ── Home ────────────────────────────────────────────────
    home: singleton({
      label: 'Home',
      path: 'src/content/home',
      format: { data: 'json' },
      schema: {
        hero: fields.object(
          {
            title: fields.text({ label: 'Título', multiline: true }),
            subtitle: fields.text({ label: 'Subtítulo', multiline: true }),
            ctaLabel: fields.text({ label: 'Texto do botão' }),
            ctaHref: fields.text({ label: 'Link do botão', defaultValue: '/#contato' }),
          },
          { label: 'Hero (topo)' },
        ),
        marquee: fields.array(fields.text({ label: 'Termo' }), {
          label: 'Faixa rolante (termos)',
          itemLabel: (p) => p.value || 'Termo',
        }),
        differentials: fields.array(
          fields.object({
            title: fields.text({ label: 'Título' }),
            text: fields.text({ label: 'Texto', multiline: true }),
          }),
          { label: 'Diferenciais', itemLabel: (p) => p.fields.title.value || 'Diferencial' },
        ),
        about: fields.object(
          {
            title: fields.text({ label: 'Título', multiline: true }),
            paragraphs: fields.array(fields.text({ label: 'Parágrafo', multiline: true }), {
              label: 'Parágrafos',
              itemLabel: (p) => p.value?.slice(0, 40) || 'Parágrafo',
            }),
            ctaLabel: fields.text({ label: 'Texto do link' }),
          },
          { label: 'Sobre' },
        ),
        servicesHeader: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            title: fields.text({ label: 'Título' }),
          },
          { label: 'Cabeçalho — Serviços' },
        ),
        portfolioHeader: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            title: fields.text({ label: 'Título', multiline: true }),
            description: fields.text({ label: 'Descrição', multiline: true }),
          },
          { label: 'Cabeçalho — Portfólio' },
        ),
        processHeader: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            title: fields.text({ label: 'Título' }),
            description: fields.text({ label: 'Descrição', multiline: true }),
          },
          { label: 'Cabeçalho — Processo' },
        ),
        ctaFinal: fields.object(
          {
            title: fields.text({ label: 'Título', multiline: true }),
            description: fields.text({ label: 'Descrição', multiline: true }),
            buttonLabel: fields.text({ label: 'Texto do botão' }),
          },
          { label: 'CTA Final' },
        ),
      },
    }),

    // ── Galeria de marketing (equipe em ação) ───────────────
    marketingGallery: singleton({
      label: 'Galeria — Marketing',
      path: 'src/content/marketing-gallery',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Em ação' }),
        title: fields.text({ label: 'Título' }),
        description: fields.text({ label: 'Descrição', multiline: true }),
        images: fields.array(
          fields.image({
            label: 'Foto',
            directory: 'public/portfolio/marketing',
            publicPath: '/portfolio/marketing/',
          }),
          { label: 'Fotos', itemLabel: (p) => p.value?.split('/').pop() || 'Foto' },
        ),
      },
    }),

    // ── Contatos ────────────────────────────────────────────
    contact: singleton({
      label: 'Contatos',
      path: 'src/content/contact',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Título da seção', multiline: true }),
        description: fields.text({ label: 'Descrição', multiline: true }),
        locations: fields.text({ label: 'Localidades', description: 'Separadas por ·' }),
        email: fields.text({ label: 'E-mail' }),
        whatsBrLabel: fields.text({ label: 'WhatsApp BR — número exibido' }),
        whatsBrUrl: fields.url({ label: 'WhatsApp BR — link wa.me' }),
        whatsUsLabel: fields.text({ label: 'WhatsApp US — número exibido' }),
        whatsUsUrl: fields.url({ label: 'WhatsApp US — link wa.me' }),
      },
    }),

    // ── Configurações gerais (logo, social, navegação) ──────
    settings: singleton({
      label: 'Configurações',
      path: 'src/content/settings',
      format: { data: 'json' },
      schema: {
        logo: fields.image({
          label: 'Logo',
          directory: 'public',
          publicPath: '/',
        }),
        copyright: fields.text({ label: 'Rodapé (copyright + localidades)', multiline: true }),
        nav: fields.array(
          fields.object({
            label: fields.text({ label: 'Texto' }),
            href: fields.text({ label: 'Link' }),
          }),
          { label: 'Menu de navegação', itemLabel: (p) => p.fields.label.value || 'Link' },
        ),
        social: fields.array(
          fields.object({
            label: fields.text({ label: 'Texto' }),
            href: fields.url({ label: 'Link' }),
          }),
          { label: 'Redes sociais', itemLabel: (p) => p.fields.label.value || 'Rede' },
        ),
      },
    }),
  },
})
