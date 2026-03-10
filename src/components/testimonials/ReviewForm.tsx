'use client';

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "./ReviewCard";

interface ReviewFormProps {
    onAddReview: (review: Review) => void;
}

export function ReviewForm({ onAddReview }: ReviewFormProps) {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) return;

        const newReview: Review = {
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            rating,
            comment: comment.trim(),
            date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        };

        onAddReview(newReview);
        setName("");
        setComment("");
        setRating(5);
    };

    return (
        <div className="glass-panel p-6 rounded-xl w-full max-w-2xl mx-auto border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <h3 className="text-2xl font-bold mb-6 text-zinc-100">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Rating Selector */}
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm text-zinc-400 font-medium">Your Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(null)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hoveredRating ?? rating)
                                            ? "fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                            : "fill-zinc-800 text-zinc-800"
                                        } transition-all duration-200`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="text-sm text-zinc-400 font-medium mb-1 block">
                        Name / Handle
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        maxLength={50}
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 rounded-lg px-4 py-2 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Comment Input */}
                <div>
                    <label htmlFor="comment" className="text-sm text-zinc-400 font-medium mb-1 block">
                        Your Experience
                    </label>
                    <textarea
                        id="comment"
                        required
                        placeholder="How did you like using the configurator?"
                        maxLength={500}
                        rows={4}
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors resize-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={!name.trim() || !comment.trim()}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 h-12 text-lg font-medium transition-all"
                >
                    Submit Review
                </Button>
            </form>
        </div>
    );
}
