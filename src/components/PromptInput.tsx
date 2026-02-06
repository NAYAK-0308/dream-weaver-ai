import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const examplePrompts = [
  "A cyberpunk city at sunset",
  "Astronaut floating in a nebula",
  "Magical forest with bioluminescence",
  "Steampunk clockwork dragon",
];

const PromptInput = ({ onGenerate, isGenerating }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    if (!isGenerating) {
      onGenerate(example);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit}>
        <div className="glow-border rounded-2xl">
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-2 pl-5 shadow-lg shadow-background/50">
            <Sparkles className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base md:text-lg py-2"
              disabled={isGenerating}
            />
            <motion.button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Generate
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {!isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {examplePrompts.map((example) => (
              <motion.button
                key={example}
                onClick={() => handleExampleClick(example)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60 rounded-full px-4 py-1.5 transition-colors"
              >
                {example}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptInput;
