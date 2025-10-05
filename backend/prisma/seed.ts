// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed do banco de dados para o HandMind...')
    await prisma.module.deleteMany()
    const modules = await prisma.module.createMany({
        data: [
            { title: "Alfabeto Manual", description: "Aprenda os sinais para cada letra do alfabeto.", level: 1, imageUrl: "/images/alfabeto.jpg", isLocked: false },
            { title: "Saudações", description: "Comunique-se com 'Oi', 'Tudo bem?', 'Bom dia' e mais.", level: 2, imageUrl: "/images/saudacoes.jpg", isLocked: false },
            { title: "Números em Libras", description: "Domine a sinalização dos números de 0 a 100.", level: 3, imageUrl: "/images/numeros.jpg", isLocked: true },
            { title: "Cores e Seus Sinais", description: "Aprenda a sinalizar as cores primárias e secundárias.", level: 4, imageUrl: "/images/cores.jpg", isLocked: true },
            { title: "Membros da Família", description: "Sinalize 'mãe', 'pai', 'irmão', 'filha' e outros parentes.", level: 5, imageUrl: "/images/familia.jpg", isLocked: true },
        ]
    })
    console.log(`✅ ${modules.count} módulos criados com sucesso!`)
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });