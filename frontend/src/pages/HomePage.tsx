// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import ModuleCard, { type ModuleData } from '../components/ModuleCard';
import { fetchModules } from '../services/api';

function HomePage() {
    const [modules, setModules] = useState<ModuleData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadFromApi = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchModules();
            setModules(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(`Falha ao carregar módulos: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadFromApi(); }, []);

    if (isLoading) return <div className="text-center mt-5"><h2>Carregando módulos...</h2></div>;
    if (error) return <div className="alert alert-danger mt-5"><h4>Erro</h4><p>{error}</p></div>;

    return (
        <div className="container">
            <h2 className="text-center mb-4">Nossos Módulos de Aprendizado ({modules.length})</h2>
            <div className="row">
                {modules.map(module => (
                    <ModuleCard key={module.id} module={module} />
                ))}
            </div>
        </div>
    );
}
export default HomePage;