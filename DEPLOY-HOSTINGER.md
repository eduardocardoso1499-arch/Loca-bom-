# Deploy da Loca Bom na Hostinger (hospedagem compartilhada)

A Hostinger (planos Premium/Business) roda apps Node.js através do recurso **"Node.js"**
no hPanel (baseado em Passenger). Ele não entende `npm run dev`/`next start` diretamente — por
isso o projeto já inclui um `server.js` próprio que o Passenger consegue iniciar.

## 0. Backup e remoção do WordPress atual em locabom.com

O domínio já tem um WordPress publicado. Antes de qualquer coisa:

1. **hPanel → Sites → locabom.com → Backups** (ou "Backup do site"): gere e baixe um backup
   completo (arquivos + banco de dados). Guarde esse `.zip` no seu computador — é sua rede de
   segurança caso queira voltar atrás.
2. **hPanel → Sites**: localize o WordPress instalado em `locabom.com` e **desinstale/remova**
   esse site (ou, se preferir não remover ainda, ao menos anote que ele está ocupando o domínio
   — você vai reatribuir o domínio ao app Node.js no passo 1).

Só depois desse passo o domínio fica livre para ser apontado para o app Node.js.

## 1. Criar a aplicação Node.js no hPanel

1. Acesse o **hPanel** → **Avançado** → **Node.js**.
2. Clique em **Criar aplicação**.
3. Preencha:
   - **Versão do Node.js**: 18.x ou 20.x (o que estiver disponível).
   - **Modo da aplicação**: Produção.
   - **Raiz da aplicação**: uma pasta dentro da sua conta, ex: `locabom` (não precisa ser
     `public_html` diretamente).
   - **URL da aplicação**: o seu domínio (ou subdomínio) já configurado na Hostinger.
   - **Arquivo de inicialização (startup file)**: `server.js`
4. Salve. O hPanel vai mostrar um comando parecido com:
   ```
   source /home/SEU_USUARIO/nodevenv/locabom/18/bin/activate && cd /home/SEU_USUARIO/locabom
   ```
   Guarde esse comando — você vai usá-lo no terminal (SSH ou terminal do próprio hPanel).

## 2. Enviar os arquivos do projeto

Envie todo o conteúdo desta pasta **exceto** `node_modules`, `.next` e `prisma/dev.db`
(esses serão gerados/recriados no servidor) para a "Raiz da aplicação" criada no passo 1.
Pode ser via:
- **Gerenciador de Arquivos** do hPanel (compacte em `.zip` aqui no seu PC e envie), ou
- **SSH/SFTP**, se seu plano tiver acesso habilitado (Avançado → SSH Access).

## 3. Instalar dependências e gerar o Prisma Client no servidor

Entre no terminal (hPanel tem um "Terminal" em Avançado, ou via SSH) e rode o comando que o
hPanel te deu no passo 1, depois:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

Rodar `npm install` e `prisma generate` **diretamente no servidor** é importante: os binários
do Prisma são compilados para o sistema operacional específico da Hostinger, e não vão
funcionar se você só copiar o `node_modules` do Windows.

## 4. Configurar variáveis de ambiente

No hPanel → Node.js → sua aplicação → **Variáveis de ambiente**, adicione:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | `file:./prisma/prod.db` |
| `JWT_SECRET` | uma string aleatória longa e secreta (não reaproveite a de desenvolvimento) |
| `NODE_ENV` | `production` |

Gere um `JWT_SECRET` forte, por exemplo com `openssl rand -hex 32` no terminal.

## 5. Iniciar/reiniciar a aplicação

No hPanel → Node.js → sua aplicação, clique em **Reiniciar**. O Passenger vai executar
`node server.js`, que sobe o Next.js já compilado na porta que a Hostinger define
automaticamente (`process.env.PORT`).

## 6. Testar

Acesse o domínio configurado. Teste o fluxo completo: criar conta, anunciar um equipamento,
solicitar aluguel, aprovar no painel.

## Observações importantes

- **Banco de dados**: o SQLite é um arquivo dentro da própria pasta da aplicação. Ele
  **não deve** ser sobrescrito em deploys futuros — ao atualizar o código, envie só os
  arquivos alterados (não a pasta `prisma/prod.db`), ou faça backup antes.
- **Migrações futuras**: sempre que alterar `prisma/schema.prisma`, gere a migration
  localmente (`npx prisma migrate dev --name algo`), envie a pasta `prisma/migrations` para
  o servidor, e rode `npx prisma migrate deploy` lá.
- **Domínio com muito tráfego**: se o projeto crescer, SQLite em hospedagem compartilhada é
  uma limitação real (não lida bem com muitos acessos simultâneos de escrita). Nesse ponto
  vale migrar para um banco Postgres gerenciado (ex: Neon, Supabase) trocando só a
  `DATABASE_URL` e o `provider` do `schema.prisma`.
