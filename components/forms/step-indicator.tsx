"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  User, 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileText, 
  ShieldCheck,
  Check
} from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: "Pribadi", icon: <User className="w-4 h-4" /> },
  { id: 2, label: "Pendidikan", icon: <GraduationCap className="w-4 h-4" /> },
  { id: 3, label: "Orang Tua", icon: <Users className="w-4 h-4" /> },
  { id: 4, label: "Program", icon: <BookOpen className="w-4 h-4" /> },
  { id: 5, label: "Dokumen", icon: <FileText className="w-4 h-4" /> },
  { id: 6, label: "Review", icon: <ShieldCheck className="w-4 h-4" /> },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="relative flex items-center justify-between px-2 sm:px-12 mb-16">
      {/* Background Rail */}
      <div className="absolute left-10 right-10 top-[22px] h-[2px] bg-[#2D2A26] -z-10" />
      
      {/* Active Progress Rail */}
      <motion.div 
        className="absolute left-10 top-[22px] h-[2px] bg-[#EAC956] -z-10 shadow-[0_0_15px_rgba(234,201,86,0.3)]"
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />

      {STEPS.map((step) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex flex-col items-center gap-4 relative group">
            <motion.div 
               animate={{ 
                  scale: isActive ? 1.25 : 1,
                  backgroundColor: isActive || isCompleted ? "#EAC956" : "#2B2A23",
                  color: isActive || isCompleted ? "#3A2E00" : "#6A685F",
                  borderColor: isActive ? "rgba(234,201,86,0.4)" : "transparent"
               }}
               className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shadow-3xl",
                  isActive ? "ring-8 ring-[#EAC956]/10" : ""
               )}
            >
               {isCompleted ? (
                 <Check className="w-6 h-6 stroke-[3px]" />
               ) : (
                 step.icon
               )}
            </motion.div>
            
            <span className={cn(
               "text-[10px] font-bold uppercase tracking-widest transition-all absolute top-16 whitespace-nowrap",
               isActive ? "text-white opacity-100 scale-110" : "text-[#6A685F] opacity-70 group-hover:opacity-100"
            )}>
               {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
