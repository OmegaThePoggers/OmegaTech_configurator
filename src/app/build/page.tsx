import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, CheckCircle, AlertTriangle, Share2, Download, RefreshCw, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Build PC | OmegaTech Configurator',
    description: 'Configure your custom PC build.',
};

export default function ConfiguratorPage() {
    const categories = ['CPU', 'GPU', 'RAM', 'Storage', 'PSU', 'Case'];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Panel: Component Selection & 3D Viewer */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="flex justify-between items-end mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Build Your PC</h1>
                    </div>

                    {/* 3D Viewer Placeholder */}
                    <div className="w-full h-[400px] bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        <div className="z-10 flex flex-col items-center text-zinc-500">
                            <Monitor className="w-12 h-12 mb-4 opacity-50" />
                            <p className="font-mono text-sm">[Interactive 3D Viewer Area]</p>
                        </div>
                    </div>

                    {/* Component Selection Grid */}
                    <div className="grid gap-4 mt-8">
                        <h3 className="text-xl font-semibold mb-2">Select Components</h3>
                        {categories.map((category) => (
                            <Card key={category} className="bg-zinc-900/50 border-zinc-800">
                                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="w-full md:w-1/4">
                                        <span className="font-medium text-zinc-300">{category}</span>
                                    </div>
                                    <div className="w-full md:w-3/4">
                                        <select
                                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select {category}...</option>
                                            <option value="test1">Placeholder Option 1 - ₹10,000</option>
                                            <option value="test2">Placeholder Option 2 - ₹20,000</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Summary & Stats */}
                <div className="w-full lg:w-1/3">
                    <div className="sticky top-24 space-y-6">

                        {/* Compatibility Status */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    Build Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-zinc-400">Compatibility:</span>
                                    <span className="text-emerald-400 font-medium">100% Good</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Performance Score:</span>
                                    <span className="text-zinc-100 font-mono">0 / 100</span>
                                </div>
                                {/* Warning Placeholder */}
                                {/* <div className="mt-4 p-3 bg-amber-950/30 border border-amber-900/50 rounded-md flex gap-2 text-amber-500 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Warning: Potential bottleneck.</span>
                </div> */}
                            </CardContent>
                        </Card>

                        {/* Price Summary */}
                        <Card className="bg-zinc-900 border-zinc-800 flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Configuration Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                                <div className="space-y-3 flex-grow mb-6">
                                    {categories.map((cat) => (
                                        <div key={cat} className="flex justify-between text-sm">
                                            <span className="text-zinc-500">{cat}:</span>
                                            <span className="text-zinc-300">--</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px w-full bg-zinc-800 mb-4" />

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-medium">Total Cost:</span>
                                    <span className="text-2xl font-bold font-mono">₹0</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium col-span-2">
                                        Save Configuration
                                    </Button>
                                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800" size="sm">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800" size="sm" disabled>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-amber-500 hover:text-amber-400" size="sm">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Randomize
                                    </Button>
                                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-rose-500 hover:text-rose-400" size="sm">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>

                    </div>
                </div>

            </div>
        </div>
    );
}
