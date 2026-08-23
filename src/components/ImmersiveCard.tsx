import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ImmersiveCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type SpotlightStyle = CSSProperties & {
  "--card-x": string;
  "--card-y": string;
};

export function ImmersiveCard({ children, className, delay = 0 }: ImmersiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const card = cardRef.current;
    if (!card) return;

    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rx = ((y / bounds.height) - 0.5) * -7;
    const ry = ((x / bounds.width) - 0.5) * 7;

    card.style.setProperty("--card-x", `${x}px`);
    card.style.setProperty("--card-y", `${y}px`);
    rotateX.set(rx);
    rotateY.set(ry);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: [28, -5, 0] }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="h-full [perspective:1100px]"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          "--card-x": "50%",
          "--card-y": "50%",
        } as SpotlightStyle}
        className={cn("card-spotlight h-full will-change-transform", className)}
      >
        <div className="relative z-[1] h-full [transform:translateZ(18px)]">{children}</div>
      </motion.div>
    </motion.div>
  );
}