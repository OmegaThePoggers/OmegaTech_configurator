import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Contact | OmegaTech Configurator',
    description: 'Get in touch with OmegaTech support.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-12">
                Contact Us
            </h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full h-10 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-shadow"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full h-10 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-shadow"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-zinc-300">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-shadow resize-y"
                            placeholder="How can we help?"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
                        Send Message
                    </Button>
                </form>
            </div>
        </div>
    );
}
