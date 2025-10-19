// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModuleDetailPage from './pages/ModuleDetailPage'; // Adaptado de Tarefa 2
import Header from './components/Header';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext'; // Importação da Tarefa 3

function App() {
    // Títulos adaptados para o HandMind
    const appTitle: string = "HandMind: Aprendendo Libras";
    const subTitle: string = "Plataforma de módulos interativos";

    return (
        <AuthProvider> {/* Envolvendo com AuthProvider */}
            <CartProvider>
                <div className="container-fluid bg-light min-vh-100">
                    <Header title={appTitle} subtitle={subTitle} />
                    <main className="container">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            {/* Rota adaptada para Módulos */}
                            <Route path="/module/:moduleId" element={<ModuleDetailPage />} />
                            <Route path="*" element={ <div>Página não encontrada</div> } />
                        </Routes>
                    </main>
                    <footer className="mt-5 py-4 border-top bg-white">
                        <p className="text-center text-muted">
                            © {new Date().getFullYear()} HandMind — API com Autenticação
                        </p>
                    </footer>
                </div>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;