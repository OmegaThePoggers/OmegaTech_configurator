'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Trash2, Calendar } from 'lucide-react';
import { getBuilds, deleteBuild, SavedBuild } from '@/lib/storage';
import Link from 'next/link';

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function ConfigsPage() {
    const [builds, setBuilds] = useState<SavedBuild[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setBuilds(getBuilds());
        setLoaded(true);
    }, []);

    const handleDelete = (id: string) => {
        deleteBuild(id);
        setBuilds(getBuilds());
    };

    if (!loaded) return null;

    if (builds.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-6xl flex-grow flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-12">
                    Saved Configurations
                </h1>
                <div className="flex-grow flex items-center justify-center min-h-[400px]">
                    <Card className="bg-zinc-900/50 border-zinc-800 border-dashed max-w-md w-full">
                        <CardContent className="flex flex-col items-center text-center pt-10 pb-10">
                            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                                <Monitor className="w-8 h-8 text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-300 mb-2">No builds saved yet</h3>
                            <p className="text-zinc-500 text-sm mb-6">
                                Configure a PC and hit &quot;Save Configuration&quot; to see it here.
                            </p>
                            <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300">
                                <Link href="/build">Start Building</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Saved Configurations
                    <span className="text-zinc-500 text-xl font-normal ml-3">({builds.length})</span>
                </h1>
                <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300" size="sm">
                    <Link href="/build">+ New Build</Link>
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {builds.map((build, index) => (
                    <Card key={build.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardHeader className="pb-2 flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg font-medium text-zinc-100">
                                    {build.name} #{builds.length - index}
                                </CardTitle>
                                <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {timeAgo(build.savedAt)}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-500 hover:text-rose-400"
                                onClick={() => handleDelete(build.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1.5 mb-4">
                                {Object.entries(build.components).map(([category, comp]) => (
                                    <div key={category} className="flex justify-between text-sm">
                                        <span className="text-zinc-500 font-mono text-xs uppercase">{category}</span>
                                        <span className="text-zinc-300 text-right truncate max-w-[200px]" title={comp.name}>
                                            {comp.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="h-px w-full bg-zinc-800 mb-3" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-zinc-400">Total</span>
                                <span className="text-lg font-bold font-mono text-zinc-100">
                                    ₹{build.totalPrice.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
