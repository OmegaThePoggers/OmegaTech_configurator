export type SavedBuild = {
    id: string;
    name: string;
    components: Record<string, { name: string; price: number }>;
    totalPrice: number;
    savedAt: string;
};

const STORAGE_KEY = 'omega_builds';

export function getBuilds(): SavedBuild[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveBuild(build: Omit<SavedBuild, 'id' | 'savedAt'>): SavedBuild {
    const newBuild: SavedBuild = {
        ...build,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
    };
    const builds = getBuilds();
    builds.push(newBuild);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
    return newBuild;
}

export function deleteBuild(id: string): void {
    const builds = getBuilds().filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}
