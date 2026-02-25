import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'About | OmegaTech Configurator',
    description: 'Learn more about OmegaTech and our mission to simplify PC building.',
};

export default function AboutPage() {
    const techStack = [
        { name: 'Next.js 15', desc: 'React framework with App Router' },
        { name: 'React 19', desc: 'UI component library' },
        { name: 'Three.js', desc: 'Interactive 3D PC viewer' },
        { name: 'Tailwind CSS', desc: 'Utility-first styling' },
        { name: 'shadcn/ui', desc: 'Accessible component primitives' },
        { name: 'TypeScript', desc: 'Type-safe development' },
    ];

    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl flex-grow">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-4">
                About OmegaTech
            </h1>
            <p className="text-zinc-500 text-center mb-12 max-w-2xl mx-auto">
                Building the future of custom PC configuration, one component at a time.
            </p>

            <div className="grid gap-6">
                {/* Our Mission */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-zinc-50">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 leading-relaxed space-y-4">
                        <p>
                            OmegaTech was built with a simple goal: make custom PC building <strong className="text-zinc-200">accessible to everyone</strong>. Whether you&apos;re a
                            seasoned enthusiast or assembling your first rig, our configurator guides you through
                            component selection with real-time compatibility checks and transparent pricing.
                        </p>
                        <p>
                            We believe that building a PC shouldn&apos;t require hours of research across
                            dozens of forums and retailer sites. Our platform brings everything together — curated
                            components, instant compatibility validation, multi-store price comparison, and an
                            interactive 3D preview of your build.
                        </p>
                    </CardContent>
                </Card>

                {/* What We Offer */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-zinc-50">What We Offer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { title: 'Smart Compatibility', desc: 'Automatic DDR/socket/wattage checks prevent costly mistakes.' },
                                { title: 'Transparent Pricing', desc: 'Real prices from Amazon, Flipkart, MD Computers with direct links.' },
                                { title: '3D Build Preview', desc: 'Interactive Three.js viewer lets you see your PC take shape.' },
                                { title: 'Save & Compare', desc: 'Save multiple configurations and compare builds side-by-side.' },
                            ].map((feature) => (
                                <div key={feature.title} className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                    <h3 className="text-sm font-semibold text-zinc-200 mb-1">{feature.title}</h3>
                                    <p className="text-xs text-zinc-500">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tech Stack */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-zinc-50">Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {techStack.map((tech) => (
                                <div key={tech.name} className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50 text-center">
                                    <span className="text-sm font-mono font-medium text-zinc-200">{tech.name}</span>
                                    <p className="text-xs text-zinc-500 mt-0.5">{tech.desc}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
