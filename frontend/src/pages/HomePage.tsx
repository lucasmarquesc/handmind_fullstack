// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import ModuleCard, { type ModuleData } from '../components/ModuleCard'; // Adaptado
import ModuleForm, { type ModuleFormData } from '../components/ModuleForm'; // Adaptado
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { fetchModules } from '../services/api'; // Adaptado

function HomePage() {
    const [modules, setModules] = useState<ModuleData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { user, token } = useAuth(); // Lógica de autenticação

    const loadFromApi = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchModules(); // Busca módulos
            setModules(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(`Falha ao carregar módulos: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadFromApi(); }, []);

    // Função para criar módulo (requer token)
    const handleAddModule = async (newModuleData: ModuleFormData) => {
        if (!token) {
            alert('Você precisa estar logado para criar módulos!');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/modules', { // Rota de módulos
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Enviando o token!
                },
                body: JSON.stringify(newModuleData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao criar módulo');
            }
            alert('Módulo criado com sucesso!');
            loadFromApi(); // Recarrega a lista
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            alert(`Erro ao criar módulo: ${msg}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
    const handleRetry = () => loadFromApi();

    const filteredModules = modules.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="text-center mt-5"><h2>🌐 Carregando módulos...</h2></div>;
    if (error) return <div className="container text-center mt-5"><div className="alert alert-danger"><p>{error}</p><button className="btn btn-outline-danger" onClick={handleRetry}>🔄 Tentar Novamente</button></div></div>;

    return (
        <div className="container">
            <div className="row">
                {/* Coluna de Ação (Login ou Criar Módulo) */}
                <div className="col-lg-4 mb-4 mb-lg-0">
                    {!user ? (
                        <section className="mb-4">
                            <AuthForm /> {/* Mostra login se não logado */}
                        </section>
                    ) : (
                        <section>
                            <ModuleForm onAddModule={handleAddModule} /> {/* Mostra form de módulo se logado */}
                        </section>
                    )}
                </div>
                {/* Coluna da busca e módulos */}
                <div className="col-lg-8">
                    <section className="mb-4 p-3 card shadow-sm">
                        <h3 className="mb-3 text-center">Buscar Módulos</h3>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Digite o nome do módulo..." value={searchTerm} onChange={handleSearchChange} />
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                        </div>
                    </section>
                    <section className="my-4">
                        <h2 className="text-center mb-4">Nossos Módulos ({filteredModules.length})</h2>
                        <div className="row">
                            {filteredModules.length > 0 ? (
                                filteredModules.map(module => (
                                    <ModuleCard key={module.id} module={module} />
                                ))
                            ) : (
                                <div className="col-12 text-center"><div className="alert alert-info">Nenhum módulo encontrado.</div></div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default HomePage;