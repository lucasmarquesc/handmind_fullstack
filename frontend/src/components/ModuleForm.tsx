// src/components/ModuleForm.tsx
import React, { useState } from 'react';
import { z } from 'zod';

export const createModuleSchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    level: z.coerce.number().int().positive('O nível deve ser um número inteiro positivo'),
    imageUrl: z.string().min(1, 'A URL da imagem não pode ser vazia'),
    isLocked: z.coerce.boolean().optional().default(true),
});

// Tipo para os dados do formulário, inferido do schema Zod
export type ModuleFormData = z.infer<typeof createModuleSchema>;

interface ModuleFormProps {
    onAddModule: (module: ModuleFormData) => void;
}

function ModuleForm({ onAddModule }: ModuleFormProps) {
    const [formData, setFormData] = useState<ModuleFormData>({
        title: '',
        description: '',
        level: 1,
        imageUrl: '',
        isLocked: true
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(null);

        // Validar no front-end antes de enviar
        const result = createModuleSchema.safeParse({
            ...formData,
            level: Number(formData.level), // Garantir que nível é número
        });

        if (!result.success) {
            setErrors(result.error);
            return;
        }

        onAddModule(result.data);
        // Limpar formulário (opcional)
        setFormData({ title: '', description: '', level: 1, imageUrl: '', isLocked: true });
    };

    return (
        <div className="card mb-4 p-3 shadow-sm">
            <h3 className="mb-3 text-center">Adicionar Novo Módulo</h3>
            {errors && (
                <div className="alert alert-danger p-2 small">
                    <strong>Erros de Validação:</strong>
                    <ul className="mb-0">
                        {errors.issues.map(issue => (
                            <li key={issue.path[0]}>{issue.path[0]}: {issue.message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título</label>
                    <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
                </div>
                <div className="mb-3">
                    <label htmlFor="level" className="form-label">Nível</label>
                    <input type="number" step="1" className="form-control" id="level" name="level" value={formData.level} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">URL da Imagem</label>
                    <input type="text" className="form-control" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="ex: /images/alfabeto.png" />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="isLocked" name="isLocked" checked={formData.isLocked} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="isLocked">Módulo Bloqueado?</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Adicionar Módulo</button>
            </form>
        </div>
    );
}
export default ModuleForm;