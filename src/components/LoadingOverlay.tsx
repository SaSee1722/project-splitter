'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, GitBranch, Check, Brain, FileCode2, Users } from 'lucide-react';

interface LoadingOverlayProps {
  projectName: string;
}

const STEPS = [
  { icon: Brain, label: 'Connecting to Gemini AI...', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { icon: Layers, label: 'Analyzing problem & generating solution...', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { icon: FileCode2, label: 'Generating screens & project architecture...', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { icon: Users, label: 'Distributing work & mapping file ownership...', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { icon: GitBranch, label: 'Building AI prompts for each team member...', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
];

export default function LoadingOverlay({ projectName }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-t-2xl" />

        {/* Animated Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-40" />
          <div className="absolute inset-3 rounded-full bg-indigo-50 border border-indigo-200" />
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Generating Blueprint{dots}
        </h3>
        <p className="text-sm text-slate-500 mb-6 font-mono">
          <span className="text-indigo-600 font-semibold">{projectName || 'Your Project'}</span>
        </p>

        {/* Progress */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step list */}
        <div className="space-y-2.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                  isCurrent
                    ? 'opacity-100'
                    : isCompleted
                    ? 'opacity-70'
                    : 'opacity-30'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : isCurrent
                      ? `${step.bg} ${step.border} ${step.color}`
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? step.color : 'text-slate-400'} ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? 'text-slate-800' : isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 font-mono">
          This may take 15–30 seconds for complex projects
        </p>
      </div>
    </div>
  );
}
