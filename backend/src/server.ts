// backend/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { z, ZodError } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'


const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- Zod Schemas para Módulo ---
export const createModuleSchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    level: z.coerce.number().int().positive('O nível deve ser um número inteiro positivo'),
    imageUrl: z.string().min(1, 'A URL da imagem não pode ser vazia'),
    isLocked: z.coerce.boolean().optional().default(true),
});
const updateModuleSchema = createModuleSchema.partial();

// --- Rotas CRUD para /api/modules ---
app.get('/api/modules', async (_req: Request, res: Response) => {
    const modules = await prisma.module.findMany({ orderBy: { level: 'asc' } });
    return res.status(200).json(modules);
});

app.get('/api/modules/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    const module = await prisma.module.findUnique({ where: { id } });
    if (!module) return res.status(404).json({ error: 'Módulo não encontrado' });
    return res.status(200).json(module);
});

app.post('/api/modules', async (req: Request, res: Response) => {
    try {
        const data = createModuleSchema.parse(req.body);
        const newModule = await prisma.module.create({ data });
        return res.status(201).json(newModule);
    } catch (error) {
        if (error instanceof ZodError) return res.status(400).json({ error: 'Payload inválido', issues: error.issues });
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.put('/api/modules/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    try {
        const data = updateModuleSchema.parse(req.body);
        const updated = await prisma.module.update({ where: { id }, data });
        return res.status(200).json(updated);
    } catch (error) {
        if (error instanceof ZodError) return res.status(400).json({ error: 'Payload inválido', issues: error.issues });
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') return res.status(404).json({ error: 'Módulo não encontrado' });
        return res.status(500).json({ error: 'Erro interno' });
    }
});

app.delete('/api/modules/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    try {
        await prisma.module.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') return res.status(404).json({ error: 'Módulo não encontrado' });
        return res.status(500).json({ error: 'Erro interno' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor HandMind rodando com sucesso em http://localhost:${PORT}`);
});