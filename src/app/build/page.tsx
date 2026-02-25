'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Share2, Download, RefreshCw, Trash2, ShoppingCart, Check, Save } from 'lucide-react';
import pcComponentsData from '@/data/pc-components.json';
import { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { PCViewer } from '@/components/viewer/PCViewer';
import { saveBuild } from '@/lib/storage';

// Types based on the JSON structure
type ComponentStoreLink = { store: string; url: string };
type ComponentItem = {
    name: string;
    price: number;
    purchaseLinks: ComponentStoreLink[];
    socket?: string;
    ddrGeneration?: string;
    tdp?: number;
    cores?: number;
    brand?: string;
    recommendedPsu?: number;
    length?: number;
    speed?: number;
    capacity?: number | string;
    modules?: number;
    type?: string;
    interface?: string;
    wattage?: number;
    rating?: string;
    modular?: boolean;
    formFactor?: string;
    maxGpuLength?: number;
    fans?: number;
};
type ComponentCategory = 'CPU' | 'GPU' | 'RAM' | 'Storage' | 'PSU' | 'Case';
type SelectedComponentsState = Partial<Record<ComponentCategory, ComponentItem>>;

export default function ConfiguratorPage() {
    const categories: ComponentCategory[] = ['CPU', 'GPU', 'RAM', 'Storage', 'PSU', 'Case'];
    const [selectedComponents, setSelectedComponents] = useState<SelectedComponentsState>({});
    const [buildAdded, setBuildAdded] = useState(false);
    const [saved, setSaved] = useState(false);
    const { addBuild } = useCart();

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

    const handleAddBuildToCart = () => {
        const selected = Object.entries(selectedComponents);
        if (selected.length === 0) return;
        const buildComponents = selected
            .filter(([, item]) => item !== undefined)
            .map(([category, item]) => ({
                name: item!.name,
                price: item!.price,
                category,
            }));
        addBuild(buildComponents);
        setBuildAdded(true);
        setTimeout(() => setBuildAdded(false), 2000);
    };

    const selectedCount = Object.keys(selectedComponents).length;

    const handleSave = () => {
        if (selectedCount === 0) return;
        const components: Record<string, { name: string; price: number }> = {};
        Object.entries(selectedComponents).forEach(([cat, item]) => {
            if (item) components[cat] = { name: item.name, price: item.price };
        });
        saveBuild({ name: `Custom Build`, components, totalPrice: totalCost });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const totalCost = useMemo(() => {
        return Object.values(selectedComponents).reduce((acc, item) => acc + (item?.price || 0), 0);
    }, [selectedComponents]);

    const viewerComponents = useMemo(() => {
        const result: Record<string, { name: string; brand?: string; tdp?: number; length?: number; wattage?: number; modules?: number; ddrGeneration?: string }> = {};
        Object.entries(selectedComponents).forEach(([category, item]) => {
            if (item) {
                result[category] = {
                    name: item.name,
                    brand: item.brand,
                    tdp: item.tdp,
                    length: item.length,
                    wattage: item.wattage,
                    modules: item.modules,
                    ddrGeneration: item.ddrGeneration,
                };
            }
        });
        return result;
    }, [selectedComponents]);

    const compatibilityWarnings = useMemo(() => {
        const warnings: string[] = [];
        const cpu = selectedComponents.CPU;
        const ram = selectedComponents.RAM;
        const gpu = selectedComponents.GPU;
        const psu = selectedComponents.PSU;
        const pcCase = selectedComponents.Case;

        // Check 1: DDR Generation
        if (cpu?.ddrGeneration && ram?.ddrGeneration) {
            // If CPU only supports DDR5 but RAM is DDR4
            if (cpu.ddrGeneration === 'DDR5' && ram.ddrGeneration === 'DDR4') {
                warnings.push(`Selected RAM is ${ram.ddrGeneration} but ${cpu.name} requires DDR5.`);
            }
        }

        // Check 2: PSU Wattage for GPU
        if (gpu?.recommendedPsu && psu?.wattage) {
            if (psu.wattage < gpu.recommendedPsu) {
                warnings.push(`${gpu.name} recommends a ${gpu.recommendedPsu}W PSU, but selected PSU is only ${psu.wattage}W.`);
            }
        }

        // Check 3: GPU Length vs Case
        if (gpu?.length && pcCase?.maxGpuLength) {
            if (gpu.length > pcCase.maxGpuLength) {
                warnings.push(`${gpu.name} is ${gpu.length}mm long, which exceeds ${pcCase.name}'s max length of ${pcCase.maxGpuLength}mm.`);
            }
        }

        // Check 4: Total TDP vs PSU
        if (psu?.wattage) {
            const cpuTdp = cpu?.tdp || 0;
            const gpuTdp = gpu?.tdp || 0;
            const estimatedTotalTdp = cpuTdp + gpuTdp + 50; // 50W for mobo/fans/drives

            // If total TDP is more than 85% of PSU capacity
            if (estimatedTotalTdp > psu.wattage * 0.85) {
                warnings.push(`System TDP (${estimatedTotalTdp}W) is approaching PSU limit. Consider upgrading.`);
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

                    {/* 3D Viewer */}
                    <PCViewer className="w-full h-[400px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900" selectedComponents={viewerComponents} />

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
                                    <Button
                                        className={`w-full font-medium col-span-2 ${buildAdded
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-300'
                                            }`}
                                        onClick={handleAddBuildToCart}
                                        disabled={selectedCount === 0}
                                    >
                                        {buildAdded ? (
                                            <><Check className="w-4 h-4 mr-2" />Build Added to Cart ✓</>
                                        ) : (
                                            <><ShoppingCart className="w-4 h-4 mr-2" />Add Build to Cart ({selectedCount}/6)</>
                                        )}
                                    </Button>
                                    <Button
                                        className={`w-full font-medium col-span-2 ${saved
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
                                            }`}
                                        onClick={handleSave}
                                        disabled={selectedCount === 0}
                                        size="sm"
                                    >
                                        {saved ? (
                                            <><Check className="w-4 h-4 mr-2" />Configuration Saved ✓</>
                                        ) : (
                                            <><Save className="w-4 h-4 mr-2" />Save Configuration</>
                                        )}
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
