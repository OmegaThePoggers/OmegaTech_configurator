'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function ContactForm() {
    return (
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
            <CardHeader>
                <CardTitle className="text-xl text-zinc-50">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Subject</label>
                        <input
                            type="text"
                            placeholder="What's this about?"
                            className="w-full h-10 px-3 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Message</label>
                        <textarea
                            rows={5}
                            placeholder="Tell us what's on your mind..."
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
