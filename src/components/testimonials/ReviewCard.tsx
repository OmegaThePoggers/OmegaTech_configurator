import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface Review {
    id: string;
    name: string;
    rating: number; // 1-5
    date: string;
    comment: string;
}

export function ReviewCard({ review }: { review: Review }) {
    return (
        <Card className="glass-panel hover:glass-accent transition-all duration-300 h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-semibold text-zinc-100">{review.name}</h3>
                        <p className="text-sm text-zinc-400">{review.date}</p>
                    </div>
                    <div className="flex bg-zinc-950/50 px-2 py-1 rounded-full border border-white/5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating
                                        ? "fill-amber-500 text-amber-500"
                                        : "fill-zinc-800 text-zinc-800"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2 flex-grow">
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                    "{review.comment}"
                </p>
            </CardContent>
        </Card>
    );
}
