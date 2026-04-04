"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      className="gap-2 border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72] hover:text-white"
    >
      <Printer className="h-4 w-4" />
      Cetak Kartu
    </Button>
  );
}
