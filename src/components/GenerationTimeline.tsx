import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const steps = [
  { emoji: "🎨", text: "Analyzing your creative vision..." },
  { emoji: "🧠", text: "Warming up the neural networks..." },
  { emoji: "🖌️", text: "Painting pixels with AI magic..." },
  { emoji: "☕", text: "Grab a coffee, good things take time..." },
  { emoji: "✨", text: "Adding the finishing touches..." },
  { emoji: "🔍", text: "Final quality check..." },
  { emoji: "🎉", text: "Your masterpiece is ready!" },
];

interface GenerationTimelineProps {
  currentStep: number;
  isComplete: boolean;
}

const GenerationTimeline = ({ currentStep, isComplete }: GenerationTimelineProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = index === currentStep && !isComplete;
        const isDone = index < currentStep || isComplete;
        const isVisible = index <= currentStep || isComplete;

        if (!isVisible) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 transition-colors duration-300 ${
                isDone
                  ? "bg-primary/20 text-primary"
                  : isActive
                  ? "bg-primary/10 text-primary pulse-dot"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5" />
              ) : isActive ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
            </div>
            <span
              className={`text-sm leading-relaxed transition-colors duration-300 ${
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.emoji} {step.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GenerationTimeline;
