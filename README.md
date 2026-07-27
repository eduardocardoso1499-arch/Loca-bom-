# Loca Bom

Marketplace peer-to-peer (asset-light) que conecta donos de equipamentos ociosos a quem precisa
alugar, com painel de controle para gerenciar anúncios e solicitações.

## Stack

- Next.js 14 (App Router) + TypeScript
- Prisma + SQLite (banco local em arquivo, fácil de trocar por Postgres depois)
- Tailwind CSS
- Autenticação simples via JWT em cookie httpOnly + bcrypt

## Funcionalidades do MVP

- Cadastro / login de usuários
- Anunciar um equipamento (título, descrição, categoria, preço/dia, cidade, foto opcional)
- Explorar e buscar equipamentos por texto, categoria e cidade
- Solicitar aluguel de um equipamento (período + mensagem)
- Painel de controle:
  - **Meus Anúncios**: pausar/ativar, excluir
  - **Solicitações Recebidas**: aprovar ou recusar pedidos de aluguel
  - **Minhas Solicitações**: acompanhar status, cancelar pedidos pendentes

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed   # cria usuários e anúncios de exemplo
npm run dev
```

Acesse em `http://localhost:3000`.

Usuários de teste criados pelo seed (senha `senha123`):
- ana@exemplo.com
- bruno@exemplo.com

## Estrutura

```
app/
  page.tsx                 # home: busca + listagem
  login/, registro/         # autenticação
  anuncios/novo/            # criar anúncio
  equipamentos/[id]/        # detalhe do anúncio + solicitar aluguel
  painel/                   # dashboard (anúncios, solicitações)
  api/                      # rotas de API (auth, equipamentos, solicitações)
lib/
  prisma.ts, auth.ts, session.ts, categories.ts
prisma/
  schema.prisma, seed.js
```

## Próximos passos (fora do escopo do MVP)

- Upload real de imagens (hoje é só URL)
- Mensagens entre locador e locatário
- Pagamento/checkout integrado
- Avaliações entre usuários
