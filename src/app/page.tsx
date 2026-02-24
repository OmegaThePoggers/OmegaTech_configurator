import Link from "next/link";
import { Cpu, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      {/* Hero Section */}
      <section className="w-full py-24 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500 drop-shadow-sm">
          OmegaTech PC Configurator
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Build your dream gaming PC with cutting-edge components and real-time compatibility checks.
        </p>
        <Button size="lg" className="h-14 px-8 text-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200" asChild>
          <Link href="/build">Start Building</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-zinc-900/50 border-y border-zinc-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-950/50 border-zinc-800 text-center hover:border-zinc-700 transition-colors">
              <CardHeader className="pt-8">
                <div className="mx-auto bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                  <Cpu className="w-8 h-8 text-zinc-300" />
                </div>
                <CardTitle className="text-xl">Expert Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-zinc-400 text-base">
                  Curated list of the latest and greatest PC components.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800 text-center hover:border-zinc-700 transition-colors">
              <CardHeader className="pt-8">
                <div className="mx-auto bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-xl">Live Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-zinc-400 text-base">
                  Instant feedback on component compatibility to avoid issues.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800 text-center hover:border-zinc-700 transition-colors">
              <CardHeader className="pt-8">
                <div className="mx-auto bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                  <DollarSign className="w-8 h-8 text-amber-500" />
                </div>
                <CardTitle className="text-xl">Transparent Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-zinc-400 text-base">
                  Real-time cost updates as you build your dream machine.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg border border-zinc-700">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Select Components</h3>
                  <p className="text-zinc-400 leading-relaxed">Choose from a wide range of CPUs, GPUs, RAM, and more. Our smart filters help you find the perfect parts.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg border border-zinc-700">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Check Compatibility</h3>
                  <p className="text-zinc-400 leading-relaxed">Our system automatically verifies that your chosen components work together seamlessly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg border border-zinc-700">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
                  <p className="text-zinc-400 leading-relaxed">Save your build, get a shareable link, and even export a PDF summary of your configuration.</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center">
              <div className="text-zinc-600 flex flex-col items-center">
                <div className="w-24 h-24 mb-4 opacity-20 bg-zinc-400 rounded-xl"></div>
                <p className="font-mono text-sm">[3D PC View Placeholder]</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
