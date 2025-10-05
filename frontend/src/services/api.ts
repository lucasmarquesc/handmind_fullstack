import type { ModuleData } from '../components/ModuleCard';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function handle<T>(resp: Response): Promise<T> {
    if (!resp.ok) {
        const msg = await resp.text().catch(() => '');
        throw new Error(`HTTP ${resp.status} - ${msg || resp.statusText}`);
    }
    return resp.json();
}

export async function fetchModules(): Promise<ModuleData[]> {
    const resp = await fetch(`${BASE_URL}/api/modules`);
    return handle<ModuleData[]>(resp);
}

export async function fetchModuleById(id: number): Promise<ModuleData> {
    const resp = await fetch(`${BASE_URL}/api/modules/${id}`);
    return handle<ModuleData>(resp);
}