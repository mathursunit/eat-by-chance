import React, { useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';

export function RouletteWheel({ items, onSpinComplete, isSpinning }) {
    const [scope, animate] = useAnimate();
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        if (isSpinning) {
            spin();
        }
    }, [isSpinning]);

    const spin = async () => {
        if (items.length === 0) return;

        // Minimum 5 spins (1800 deg) + random
        const randomOffset = Math.random() * 360;
        const extraSpins = 360 * 5;
        const targetRotation = rotation + extraSpins + randomOffset;

        await animate(scope.current, { rotate: targetRotation }, {
            duration: 4,
            ease: [0.2, 0.8, 0.2, 1] // cubic-bezier for ease-out
        });

        setRotation(targetRotation);

        // Calculate winner
        // The pointer is at 0 degrees (top).
        // The wheel rotated clockwise. properties at top are those at (360 - Angle)
        const normalizedRotation = targetRotation % 360;
        const pointerAngle = (360 - normalizedRotation) % 360;
        const segmentSize = 360 / items.length;
        const winnerIndex = Math.floor(pointerAngle / segmentSize);

        // Safety check
        if (items[winnerIndex]) {
            onSpinComplete(items[winnerIndex]);
        } else {
            onSpinComplete(items[0]); // Fallback
        }
    };

    const colors = ['#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

    const gradient = items.map((_, i) => {
        const start = (i / items.length) * 100;
        const end = ((i + 1) / items.length) * 100;
        const color = colors[i % colors.length];
        return `${color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="wheel-wrapper">
            <div className="wheel-pointer"></div>
            <motion.div
                ref={scope}
                className="wheel"
                style={{
                    background: `conic-gradient(${gradient})`,
                    rotate: rotation
                }}
                initial={{ rotate: 0 }}
            >
                {items.map((item, i) => {
                    const segmentSize = 360 / items.length;
                    const angle = segmentSize * i + segmentSize / 2; // Center of segment

                    return (
                        <div
                            key={item.id}
                            className="wheel-label-container"
                            style={{
                                transform: `rotate(${angle}deg)`
                            }}
                        >
                            <div className="wheel-label">
                                {i + 1}
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
