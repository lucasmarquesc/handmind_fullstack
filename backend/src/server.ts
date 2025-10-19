// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import { z, ZodError } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

// Configuração de CORS e JSON
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Chave secreta para JWT (Mover para .env em produção)
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_super_seguro_aqui';

// --- SCHEMAS DE AUTENTICAÇÃO (Tarefa 3) --- [cite: 136]
const registerSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    name: z.string().optional()
});

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória')
});

// --- INTERFACE E MIDDLEWARE DE AUTENTICAÇÃO (Tarefa 3)
interface AuthRequest extends Request {
    user?: { id: number; email: string; name?: string | null };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token de acesso não fornecido' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Formato do token inválido' });
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ error: 'Token inválido' });
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// --- ROTAS DE AUTENTICAÇÃO (Tarefa 3) ---
app.get('/', (_req: Request, res: Response) => {
    res.json({ ok: true, msg: 'API HandMind no ar!' });
});

// POST /api/auth/register 
app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            message: 'Usuário criado com sucesso', token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/auth/login 
app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Email ou senha incorretos' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Email ou senha incorretos' });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            message: 'Login realizado com sucesso', token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/auth/me (Rota protegida)
app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
    return res.status(200).json({ message: 'Usuário autenticado', user: req.user });
});

// --- SCHEMAS ZOD PARA MÓDULOS ---
export const createModuleSchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    level: z.coerce.number().int().positive('O nível deve ser um número inteiro positivo'),
    imageUrl: z.string().min(1, 'A URL da imagem não pode ser vazia'),
    isLocked: z.coerce.boolean().optional().default(true),
});
const updateModuleSchema = createModuleSchema.partial();

// --- ROTAS CRUD DE MÓDULOS (GETs Públicos, Resto Protegido) ---

// GET /api/modules (Público)
app.get('/api/modules', async (_req: Request, res: Response) => {
    try {
        const modules = await prisma.module.findMany({ orderBy: { level: 'asc' } });
        return res.status(200).json(modules);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar módulos' });
    }
});

// GET /api/modules/:id (Público) 
app.get('/api/modules/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    try {
        const module = await prisma.module.findUnique({ where: { id } });
        if (!module) return res.status(404).json({ error: 'Módulo não encontrado' });
        return res.status(200).json(module);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar módulo' });
    }
});

// POST /api/modules (Protegido) 
app.post('/api/modules', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = createModuleSchema.parse(req.body);
        const newModule = await prisma.module.create({ data });
        return res.status(201).json(newModule);
    } catch (error) {
        if (error instanceof ZodError) return res.status(400).json({ error: 'Payload inválido', issues: error.issues });
        return res.status(500).json({ error: 'Erro interno ao criar módulo' });
    }
});

// PUT /api/modules/:id (Protegido) 
app.put('/api/modules/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    try {
        const data = updateModuleSchema.parse(req.body);
        const updated = await prisma.module.update({ where: { id }, data });
        return res.status(200).json(updated);
    } catch (error) {
        if (error instanceof ZodError) return res.status(400).json({ error: 'Payload inválido', issues: error.issues });
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return res.status(404).json({ error: 'Módulo não encontrado' });
        return res.status(500).json({ error: 'Erro interno ao atualizar módulo' });
    }
});

// DELETE /api/modules/:id (Protegido) 
app.delete('/api/modules/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    try {
        await prisma.module.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return res.status(404).json({ error: 'Módulo não encontrado' });
        return res.status(500).json({ error: 'Erro interno ao deletar módulo' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor HandMind rodando com sucesso em http://localhost:${PORT}`);
});