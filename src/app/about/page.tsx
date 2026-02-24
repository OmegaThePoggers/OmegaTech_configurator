import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'About | OmegaTech Configurator',
    description: 'Learn more about OmegaTech and our mission.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-12">
                About OmegaTech
            </h1>

            <div className="grid gap-8">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-zinc-50">Our Purpose</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 leading-relaxed space-y-4">
                        <p>
                            OmegaTech is dedicated to providing the ultimate PC building experience. We believe that
                            everyone, from seasoned enthusiasts to first-time builders, should have the tools to
                            create their perfect custom machine.
                        </p>
                        <p>
                            Our mission is to simplify the process of selecting and configuring components, offering
                            a curated selection of high-quality parts and a seamless, intuitive interface.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-zinc-50">Future Vision</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 leading-relaxed space-y-4">
                        <p>
                            We are constantly looking to the future. Our goal is to expand our component library,
                            integrate more advanced compatibility checks, and introduce new features that will further
                            enhance the building process.
                        </p>
                        <p>
                            We envision a platform where users can not only build their PCs but also share their
                            creations, get feedback from the community, and stay up-to-date with the latest trends
                            in the tech world.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
