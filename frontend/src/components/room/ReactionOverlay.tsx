import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Reaction {
    id: number;
    emoji: string;
    x: number;
    y: number;
}

interface ReactionOverlayProps {
    reactionEvent: { emoji: string; timestamp: number } | null;
}

const ReactionOverlay: React.FC<ReactionOverlayProps> = ({ reactionEvent }) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);

    useEffect(() => {
        if (reactionEvent) {
            const count = 15; // Number of emojis to spawn per reaction
            const newReactions: Reaction[] = [];

            for (let i = 0; i < count; i++) {
                newReactions.push({
                    id: Date.now() + i,
                    emoji: reactionEvent.emoji,
                    x: Math.random() * 100, // Random horizontal position %
                    y: 100, // Start from bottom
                });
            }

            setReactions((prev) => [...prev, ...newReactions]);

            // Cleanup after animation
            setTimeout(() => {
                setReactions((prev) => prev.filter((r) => !newReactions.includes(r)));
            }, 2000);
        }
    }, [reactionEvent]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            <AnimatePresence>
                {reactions.map((reaction) => (
                    <motion.div
                        key={reaction.id}
                        initial={{ y: '100vh', x: `${reaction.x}vw`, opacity: 1, scale: 0.5 }}
                        animate={{
                            y: '-20vh',
                            opacity: 0,
                            scale: Math.random() * 1.5 + 1,
                            rotate: Math.random() * 360
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute text-4xl"
                    >
                        {reaction.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ReactionOverlay;
