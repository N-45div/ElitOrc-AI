"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall, Stethoscope, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["intelligent", "advanced", "revolutionary", "precise", "innovative"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          {/* Header Badge */}
          <div>
            <Button variant="secondary" size="sm" className="gap-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200">
              <Stethoscope className="w-4 h-4" />
              Powered by Advanced AI & Vector Search
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Heading */}
          <div className="flex gap-6 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-bold">
              <span className="text-gray-900 dark:text-white">Clinical AI that&apos;s</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed tracking-tight text-gray-600 dark:text-gray-300 max-w-3xl text-center font-medium">
              Revolutionizing healthcare with multimodal AI analysis, vector-powered case matching, 
              and intelligent clinical decision support. Experience the future of medical diagnosis.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap gap-6 justify-center items-center text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-600" />
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-600" />
              <span>Clinical Grade</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/chat">
              <Button size="lg" className="gap-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Get Started
                <MoveRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" className="gap-4 px-8 py-6 text-lg" variant="outline">
              Schedule Demo
              <PhoneCall className="w-5 h-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered clinical decision support that chains vector search, medical imaging, and expert reasoning to provide instant diagnostic assistance for healthcare professionals.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
