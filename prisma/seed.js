const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 10);

  const ana = await prisma.user.upsert({
    where: { email: "ana@exemplo.com" },
    update: {},
    create: {
      name: "Ana Silva",
      email: "ana@exemplo.com",
      password: passwordHash,
      phone: "(11) 90000-0001",
      city: "São Paulo",
    },
  });

  const bruno = await prisma.user.upsert({
    where: { email: "bruno@exemplo.com" },
    update: {},
    create: {
      name: "Bruno Costa",
      email: "bruno@exemplo.com",
      password: passwordHash,
      phone: "(11) 90000-0002",
      city: "São Paulo",
    },
  });

  const existingCount = await prisma.equipment.count();
  if (existingCount > 0) {
    console.log("Equipamentos já existem, pulando criação de exemplos.");
    return;
  }

  await prisma.equipment.createMany({
    data: [
      {
        title: "Furadeira de impacto Bosch",
        description: "Furadeira em ótimo estado, acompanha maleta e brocas variadas.",
        category: "Ferramentas",
        dailyPrice: 25,
        city: "São Paulo",
        ownerId: ana.id,
      },
      {
        title: "Betoneira 400L",
        description: "Ideal para pequenas e médias obras. Motor revisado recentemente.",
        category: "Construção",
        dailyPrice: 80,
        city: "São Paulo",
        ownerId: ana.id,
      },
      {
        title: "Câmera DSLR Canon com tripé",
        description: "Ótima para ensaios e eventos. Acompanha 2 lentes e cartão de memória.",
        category: "Fotografia e Vídeo",
        dailyPrice: 120,
        city: "Campinas",
        ownerId: bruno.id,
      },
      {
        title: "Kit som para festas (caixas + mesa)",
        description: "Kit completo para festas de até 100 pessoas.",
        category: "Eventos e Festas",
        dailyPrice: 150,
        city: "Campinas",
        ownerId: bruno.id,
      },
    ],
  });

  console.log("Seed concluído. Usuários de teste: ana@exemplo.com / bruno@exemplo.com, senha: senha123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
