"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="gap-2 bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-2xl px-6 h-12 font-bold shadow-2xl transition-all"
    >
      <Printer className="h-5 w-5" />
      Cetak Kartu PDF
    </Button>
  );
}
