'use client';

import { useState } from "react";
import { ReviewCard, Review } from "@/components/testimonials/ReviewCard";
import { ReviewForm } from "@/components/testimonials/ReviewForm";
import { MessageSquareQuote } from "lucide-react";

// Universal dummy reviews
const INITIAL_REVIEWS: Review[] = [
    {
        id: "r1",
        name: "Alex M.",
        rating: 5,
        date: "February 24, 2026",
        comment: "The configuration tool here is absolutely mind-blowing. I usually spend hours cross-referencing compatibility on PCPartPicker, but this interface is vastly superior and so much cleaner.",
    },
    {
        id: "r2",
        name: "Sarah Jenkins",
        rating: 5,
        date: "March 2, 2026",
        comment: "I love the 3D viewer! Being able to actually see the parts in the case before I buy them made me so much more confident in my purchase. The liquid glass UI is also gorgeous.",
    },
    {
        id: "r3",
        name: "DavidRTX",
        rating: 4,
        date: "March 6, 2026",
        comment: "Great experience overall. The part selection is very curated which prevents decision paralysis. I do wish there were slightly more case options, but the ones available are top tier.",
    },
    {
        id: "r4",
        name: "Emma W.",
        rating: 5,
        date: "March 9, 2026",
        comment: "As someone who has never built a PC before, the live compatibility checks saved me from buying a motherboard that wouldn't fit my processor. 10/10 recommend for beginners and experts alike.",
    }
];

export default function TestimonialsPage() {
    const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

    const handleAddReview = (newReview: Review) => {
        // Prepend the new review so it shows up first
        setReviews([newReview, ...reviews]);
    };

    return (
        <div className="flex flex-col items-center justify-start flex-grow pb-24 pt-12 text-zinc-50 relative z-10 w-full">

            {/* Header */}
            <section className="w-full text-center px-4 mb-16">
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <MessageSquareQuote className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Wall of <span className="text-emerald-400">Praise</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    See what our community has to say about their experience building dream machines with OmegaTech, or leave your own review below.
                </p>
            </section>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 max-w-7xl flex flex-col gap-20">

                {/* Form Section */}
                <section className="w-full">
                    <ReviewForm onAddReview={handleAddReview} />
                </section>

                {/* Reviews Grid */}
                <section className="w-full">
                    <h2 className="text-2xl font-semibold mb-8 border-b border-white/10 pb-4">
                        Recent Experiences ({reviews.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {reviews.map((review) => (
                            <div key={review.id} className="h-full">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
