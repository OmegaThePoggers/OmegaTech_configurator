'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, CheckCircle, AlertTriangle, Share2, Download, RefreshCw, Trash2 } from 'lucide-react';
import pcComponentsData from '@/data/pc-components.json';
import { useState, useMemo } from 'react';

// Types based on the JSON structure
type ComponentStoreLink = { store: string; url: string };
type ComponentItem = { name: string; price: number; purchaseLinks: ComponentStoreLink[] };
type ComponentCategory = 'CPU' | 'GPU' | 'RAM' | 'Storage' | 'PSU' | 'Case';
type SelectedComponentsState = Partial<Record<ComponentCategory, ComponentItem>>;

export default function ConfiguratorPage() {
    const categories: ComponentCategory[] = ['CPU', 'GPU', 'RAM', 'Storage', 'PSU', 'Case'];
    const [selectedComponents, setSelectedComponents] = useState<SelectedComponentsState>({});

    const handleSelectComponent = (category: ComponentCategory, componentName: string) => {
        if (!componentName) {
            const newSelections = { ...selectedComponents };
            delete newSelections[category];
            setSelectedComponents(newSelections);
            return;
        }

        const categoryItems = pcComponentsData.categories[category] as ComponentItem[];
        const selectedItem = categoryItems.find(item => item.name === componentName);

        if (selectedItem) {
            setSelectedComponents(prev => ({
                ...prev,
                [category]: selectedItem
            }));
        }
    };

    const handleClearBuild = () => {
        setSelectedComponents({});
    };

    const handleRandomizeBuild = () => {
        const randomBuild: SelectedComponentsState = {};
        categories.forEach(category => {
            const items = pcComponentsData.categories[category] as ComponentItem[];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            randomBuild[category] = randomItem;
        });
        setSelectedComponents(randomBuild);
    };

    const totalCost = useMemo(() => {
        return Object.values(selectedComponents).reduce((acc, item) => acc + (item?.price || 0), 0);
    }, [selectedComponents]);

    const compatibilityWarnings = useMemo(() => {
        const warnings: string[] = [];
        const cpu = selectedComponents.CPU?.name;
        const ram = selectedComponents.RAM?.name;
        const gpu = selectedComponents.GPU?.name;
        const psu = selectedComponents.PSU?.name;

        // DDR4/DDR5 Logic
        if (cpu && ram) {
            const needsDDR5 = cpu.includes('13') || cpu.includes('7600X') || cpu.includes('7800X');
            const isDDR4 = ram.toLowerCase().includes('ddr4');
            if (needsDDR5 && isDDR4) {
                warnings.push("Selected RAM is incompatible with CPU (DDR5 required).");
            }
        }

        // PSU Wattage Logic for High-End GPUs
        if (gpu && psu) {
            const highEndGPUs = ['RTX 4080', 'RX 7900 XT'];
            const psuWattageMatch = psu.match(/\d+/);
            const psuWattage = psuWattageMatch ? parseInt(psuWattageMatch[0]) : 0;

            if (highEndGPUs.some(model => gpu.includes(model)) && psuWattage < 750) {
                warnings.push("PSU wattage may be insufficient for this GPU (750W+ recommended).");
            }
        }
        return warnings;
    }, [selectedComponents]);

    const performanceScore = useMemo(() => {
        if (!selectedComponents.CPU || !selectedComponents.GPU) return 0;

        let score = 0;
        const cpuName = selectedComponents.CPU.name;
        const gpuName = selectedComponents.GPU.name;

        if (cpuName.includes('i9')) score += 100;
        else if (cpuName.includes('7800X')) score += 90;
        else if (cpuName.includes('i7')) score += 85;
        else if (cpuName.includes('7600X')) score += 75;
        else if (cpuName.includes('i5')) score += 70;

        if (gpuName.includes('4080')) score += 100;
        else if (gpuName.includes('7900 XT')) score += 95;
        else if (gpuName.includes('4070')) score += 80;
        else if (gpuName.includes('7700 XT')) score += 75;
        else if (gpuName.includes('4060')) score += 65;

        return Math.round(score / 2);
    }, [selectedComponents]);

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
                                            value={selectedComponents[category]?.name || ""}
                                            onChange={(e) => handleSelectComponent(category, e.target.value)}
                                        >
                                            <option value="">Select {category}...</option>
                                            {(pcComponentsData.categories[category] as ComponentItem[]).map((item) => (
                                                <option key={item.name} value={item.name}>
                                                    {item.name} - ₹{item.price.toLocaleString("en-IN")}
                                                </option>
                                            ))}
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
                                    <span className={`font-medium ${compatibilityWarnings.length > 0 ? 'text-amber-500' : 'text-emerald-400'}`}>
                                        {compatibilityWarnings.length > 0 ? 'Issues Detected' : '100% Good'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="text-zinc-400">Performance Score:</span>
                                    <span className="text-zinc-100 font-mono">{performanceScore} / 100</span>
                                </div>

                                {compatibilityWarnings.length > 0 && (
                                    <div className="space-y-2">
                                        {compatibilityWarnings.map((warning, idx) => (
                                            <div key={idx} className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-md flex gap-2 text-amber-500 text-sm">
                                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <span>{warning}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                            <span className="text-zinc-300 text-right max-w-[200px] truncate" title={selectedComponents[cat]?.name || "--"}>
                                                {selectedComponents[cat]?.name || "--"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px w-full bg-zinc-800 mb-4" />

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-medium">Total Cost:</span>
                                    <span className="text-2xl font-bold font-mono">₹{totalCost.toLocaleString('en-IN')}</span>
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
                                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-amber-500 hover:text-amber-400" size="sm" onClick={handleRandomizeBuild}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Randomize
                                    </Button>
                                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-rose-500 hover:text-rose-400" size="sm" onClick={handleClearBuild}>
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
