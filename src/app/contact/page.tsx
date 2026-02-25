import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Github } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact | OmegaTech Configurator',
    description: 'Get in touch with the OmegaTech team.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl flex-grow">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-4">
                Get In Touch
            </h1>
            <p className="text-zinc-500 text-center mb-12 max-w-2xl mx-auto">
                Have questions, feedback, or feature requests? We&apos;d love to hear from you.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Contact Form Client Component */}
                <ContactForm />

                {/* Contact Info */}
                <div className="space-y-4">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-200">Email</h3>
                                    <p className="text-xs text-zinc-500">contact@omegatech.dev</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                    <Github className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-200">GitHub</h3>
                                    <p className="text-xs text-zinc-500">OmegaThePoggers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800 border-dashed">
                        <CardContent className="pt-6 text-center">
                            <p className="text-xs text-zinc-600">
                                Response time: typically within 24 hours
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
