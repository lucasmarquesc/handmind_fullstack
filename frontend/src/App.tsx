// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import Header from './components/Header';
import { CartProvider } from './contexts/CartContext';

function App() {
    const appTitle: string = "HandMind: Aprendendo Libras";
    const subTitle: string = "Módulos de aprendizado interativos";

    return (
        <CartProvider>
            <div className="bg-light min-vh-100">
                <Header title={appTitle} subtitle={subTitle} />
                <main className="container py-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/module/:moduleId" element={<ModuleDetailPage />} />
                        <Route path="*" element={<div>Página não encontrada...</div>} />
                    </Routes>
                </main>
            </div>
        </CartProvider>
    );
}

export default App;