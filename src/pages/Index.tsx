import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Download } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import CursorGlow from "@/components/CursorGlow";
import ThemeToggle from "@/components/ThemeToggle";
import PromptInput from "@/components/PromptInput";
import GenerationTimeline from "@/components/GenerationTimeline";
import sampleImage from "@/assets/sample-generated.jpg";

const STEP_DELAYS = [1500, 2000, 2500, 2000, 1500, 1200, 600];

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = useCallback((prompt: string) => {
    setGeneratedPrompt(prompt);
    setIsGenerating(true);
    setCurrentStep(0);
    setIsComplete(false);
    setShowResult(false);
  }, []);

  useEffect(() => {
    if (!isGenerating || isComplete || currentStep < 0) return;

    const delay = STEP_DELAYS[currentStep] || 1500;
    const timer = setTimeout(() => {
      if (currentStep < STEP_DELAYS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsComplete(true);
        setTimeout(() => {
          setShowResult(true);
          setIsGenerating(false);
        }, 800);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isGenerating, currentStep, isComplete]);

  const handleReset = () => {
    setIsGenerating(false);
    setCurrentStep(-1);
    setIsComplete(false);
    setShowResult(false);
    setGeneratedPrompt("");
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      <CursorGlow />

      {/* Theme toggle — top right */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          layout
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Wand2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Powered by AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-5"
          >
            Text to Image
            <span className="block text-gradient mt-1">AI Generation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Transform your words into stunning visuals with the power of
            artificial intelligence
          </motion.p>
        </motion.div>

        {/* Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-2xl mx-auto mb-12"
        >
          <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        </motion.div>

        {/* Generation Panel */}
        <AnimatePresence>
          {(isGenerating || showResult) && (
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="bg-card/60 backdrop-blur-2xl rounded-3xl border border-border/50 p-5 sm:p-8 shadow-2xl shadow-background/80">
                <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                  {/* Timeline */}
                  <div className="md:w-2/5 lg:w-1/3">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-5 uppercase tracking-[0.2em]">
                      Generation Progress
                    </h3>
                    <GenerationTimeline
                      currentStep={currentStep}
                      isComplete={isComplete}
                    />
                  </div>

                  {/* Image Area */}
                  <div className="md:w-3/5 lg:w-2/3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-border/30">
                      {!showResult ? (
                        <div className="w-full h-full shimmer flex items-center justify-center">
                          <div className="text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                              <Wand2 className="w-6 h-6 text-primary animate-pulse" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Creating your image...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <motion.img
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          src={sampleImage}
                          alt={generatedPrompt}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 flex items-center justify-between gap-4"
                      >
                        <p className="text-sm text-muted-foreground italic truncate">
                          &ldquo;{generatedPrompt}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 shrink-0">
                          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            Save
                          </button>
                          <button
                            onClick={handleReset}
                            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                          >
                            Generate another →
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
