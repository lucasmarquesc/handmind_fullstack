"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleSchema = void 0;
// backend/src/server.ts
var express_1 = require("express");
var cors_1 = require("cors");
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
var library_1 = require("@prisma/client/runtime/library");
var app = (0, express_1.default)();
var prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(express_1.default.json());
// --- Zod Schemas para Módulo ---
exports.createModuleSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    description: zod_1.z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    level: zod_1.z.coerce.number().int().positive('O nível deve ser um número inteiro positivo'),
    imageUrl: zod_1.z.string().min(1, 'A URL da imagem não pode ser vazia'),
    isLocked: zod_1.z.coerce.boolean().optional().default(true),
});
var updateModuleSchema = exports.createModuleSchema.partial();
// --- Rotas CRUD para /api/modules ---
app.get('/api/modules', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modules;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.module.findMany({ orderBy: { level: 'asc' } })];
            case 1:
                modules = _a.sent();
                return [2 /*return*/, res.status(200).json(modules)];
        }
    });
}); });
app.get('/api/modules/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, module;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(req.params.id);
                if (!Number.isInteger(id) || id <= 0)
                    return [2 /*return*/, res.status(400).json({ error: 'ID inválido.' })];
                return [4 /*yield*/, prisma.module.findUnique({ where: { id: id } })];
            case 1:
                module = _a.sent();
                if (!module)
                    return [2 /*return*/, res.status(404).json({ error: 'Módulo não encontrado' })];
                return [2 /*return*/, res.status(200).json(module)];
        }
    });
}); });
app.post('/api/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, newModule, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = exports.createModuleSchema.parse(req.body);
                return [4 /*yield*/, prisma.module.create({ data: data })];
            case 1:
                newModule = _a.sent();
                return [2 /*return*/, res.status(201).json(newModule)];
            case 2:
                error_1 = _a.sent();
                if (error_1 instanceof zod_1.ZodError)
                    return [2 /*return*/, res.status(400).json({ error: 'Payload inválido', issues: error_1.issues })];
                return [2 /*return*/, res.status(500).json({ error: 'Erro interno no servidor' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/modules/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, updated, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(req.params.id);
                if (!Number.isInteger(id) || id <= 0)
                    return [2 /*return*/, res.status(400).json({ error: 'ID inválido.' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                data = updateModuleSchema.parse(req.body);
                return [4 /*yield*/, prisma.module.update({ where: { id: id }, data: data })];
            case 2:
                updated = _a.sent();
                return [2 /*return*/, res.status(200).json(updated)];
            case 3:
                error_2 = _a.sent();
                if (error_2 instanceof zod_1.ZodError)
                    return [2 /*return*/, res.status(400).json({ error: 'Payload inválido', issues: error_2.issues })];
                if (error_2 instanceof library_1.PrismaClientKnownRequestError && error_2.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'Módulo não encontrado' })];
                return [2 /*return*/, res.status(500).json({ error: 'Erro interno' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/modules/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(req.params.id);
                if (!Number.isInteger(id) || id <= 0)
                    return [2 /*return*/, res.status(400).json({ error: 'ID inválido.' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.module.delete({ where: { id: id } })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(204).send()];
            case 3:
                error_3 = _a.sent();
                if (error_3 instanceof library_1.PrismaClientKnownRequestError && error_3.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'Módulo não encontrado' })];
                return [2 /*return*/, res.status(500).json({ error: 'Erro interno' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
var PORT = 3001;
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Servidor HandMind rodando com sucesso em http://localhost:".concat(PORT));
});
