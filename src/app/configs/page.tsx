import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Saved Builds | OmegaTech Configurator',
    description: 'View your saved PC configurations.',
};

export default function ConfigsPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-6xl flex-grow flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-12">
                Saved Configurations
            </h1>

            {/* Empty State Presentation */}
            <div className="flex-grow flex items-center justify-center min-h-[400px]">
                <Card className="bg-zinc-900/50 border-zinc-800 border-dashed max-w-md w-full">
                    <CardContent className="flex flex-col items-center text-center pt-10 pb-10">
                        <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                            <Monitor className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-300 mb-2">No builds saved yet</h3>
                        <p className="text-zinc-500 text-sm">
                            When you configure and save a PC, it will appear here. Start building to try it out!
                        </p>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
