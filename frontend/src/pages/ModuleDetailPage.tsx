// src/pages/ModuleDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { ModuleData } from '../components/ModuleCard';
import { fetchModuleById } from '../services/api';

function ModuleDetailPage() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const { addToCart } = useCart();
    const [module, setModule] = useState<ModuleData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!moduleId) return;
        const idNum = Number(moduleId);
        if (!Number.isInteger(idNum) || idNum <= 0) {
            setError('ID do módulo é inválido');
            setIsLoading(false);
            return;
        }
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await fetchModuleById(idNum);
                setModule(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [moduleId]);

    if (isLoading) return <div className="text-center mt-5"><h2>Carregando detalhes do módulo...</h2></div>;
    if (error) return <div className="alert alert-danger mt-5"><h4>Erro</h4><p>{error}</p></div>;
    if (!module) return <div className="alert alert-warning mt-5"><h4>Módulo não encontrado</h4></div>;

    return (
        <div className="container mt-4">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{module.title}</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-6 mb-4"><img src={module.imageUrl} alt={module.title} className="img-fluid rounded shadow"/></div>
                <div className="col-lg-6">
                    <h1 className="h2 mb-3">{module.title}</h1>
                    {module.isLocked && <span className="badge bg-secondary mb-3">Bloqueado</span>}
                    <div className="mb-4"><h3 className="text-primary">Nível: {module.level}</h3></div>
                    <div className="mb-4"><h5>Descrição</h5><p className="text-muted">{module.description}</p></div>
                    <div className="d-flex gap-3 mb-4">
                        <button className="btn btn-success btn-lg flex-fill" onClick={addToCart} disabled={module.isLocked}>
                            <i className="bi bi-play-circle me-2"></i> Iniciar e Salvar Progresso
                        </button>
                    </div>
                    <Link to="/" className="btn btn-outline-secondary"><i className="bi bi-arrow-left me-2"></i>Voltar para a lista</Link>
                </div>
            </div>
        </div>
    );
}

export default ModuleDetailPage;