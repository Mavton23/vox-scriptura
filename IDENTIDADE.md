# Vox Scriptura — identidade visual aplicada

Conceito **Iluminura**: lápis-lazúli (o pigmento dos manuscritos iluminados) e folha de ouro sobre papel claro.
O símbolo é um livro aberto em forma de **V** (de *Vox*) de onde sobe a luz — *“Lâmpada para os meus pés é a tua palavra”* (Sl 119:105).

## O que mudou no código (nenhuma alteração no banco / Prisma / APIs)

| Área | Ficheiros |
|---|---|
| Tokens de cor, tipografia, `.scripture`, `.versal` (capitular dourada), `.reading`, `.ref`, `container` centrado | `app/globals.css` |
| Fontes self-hosted (sem Google Fonts em build): EB Garamond + Hanken Grotesk | `app/layout.tsx`, `package.json` |
| Metadados, título por página, Open Graph, manifest PWA, theme-color | `app/layout.tsx`, `app/manifest.ts` |
| Ícones: favicon, `icon.svg`, `apple-icon.png`, OG/Twitter image, ícones PWA | `app/*`, `public/brand/*` |
| Componentes de marca: `Logo`, `LogoMark`, `Ornament` | `components/brand/logo.tsx` |
| Cabeçalho (nav com sublinhado dourado, busca com atalho `/` e Ctrl/⌘+K), rodapé | `components/layout/*` |
| Layout de autenticação com painel de marca | `components/layout/layout-provider.tsx` |
| Página inicial: a frase do dia é o herói | `app/page.tsx`, `app/loading.tsx` |
| Leitura (pergunta, doutrina, frase): `ArticleShell`, botão partilhar | `components/reading/*`, `app/*/[...]/page.tsx` |
| Cards com títulos em serifa, sem sombra | `components/ui/card.tsx` |
| Favoritos com ícone “marcador” dourado (“Guardar”) | `components/common/favorite-button.tsx` |
| Admin: sidebar com a marca, cores normalizadas | `components/admin/*`, `app/admin/*` |

### Correções de passagem
- `proxy.ts`: o redirecionamento do admin ia para `/login` (inexistente) → agora `/auth/login`.
- Removido `tailwind.config.ts` (Tailwind v4 lê o tema de `globals.css`; o ficheiro não era usado).
- Removidas as estatísticas fixas “+100 / +50 / 100%” da home (números não vinham do banco).
- A classe `hightlight` (grafia original) continua a funcionar e agora aponta para o dourado.

## Uso rápido
```tsx
import { Logo, LogoMark, Ornament } from '@/components/brand/logo'
<Logo />                       // horizontal com tagline
<Logo tone="inverse" />        // sobre lápis profundo
<LogoMark className="h-10 text-lapis" />
<blockquote className="scripture versal">…</blockquote>
<span className="ref">João 3:16</span>
<div className="reading">…markdown…</div>
```
Cores Tailwind novas: `lapis`, `lapis-deep`, `gold`, `gold-ink`.
