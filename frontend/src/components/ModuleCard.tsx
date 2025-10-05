// src/components/ModuleCard.tsx
import { Link } from 'react-router-dom';

export interface ModuleData {
    id: number;
    title: string;
    description: string;
    level: number;
    imageUrl: string;
    isLocked?: boolean;
}

export interface ModuleCardProps { module: ModuleData; }

function ModuleCard({ module }: ModuleCardProps) {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 border shadow-sm">
                {module.isLocked && (
                    <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 1 }}>
                        <span className="badge bg-secondary"><i className="bi bi-lock-fill me-1"></i> Bloqueado</span>
                    </div>
                )}
                <img src={module.imageUrl} className="card-img-top" alt={module.title} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title">{module.title}</h5>
                    <p className="card-text text-muted mb-2 flex-grow-1">{module.description}</p>
                    <p className="card-text fw-bold fs-5 mb-3">Nível {module.level}</p>
                    <div className="mt-auto pt-2">
                        <Link to={`/module/${module.id}`} className={`btn w-100 ${module.isLocked ? 'btn-outline-secondary disabled' : 'btn-primary'}`}>
                            {module.isLocked ? 'Em Breve' : 'Iniciar Módulo'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ModuleCard;