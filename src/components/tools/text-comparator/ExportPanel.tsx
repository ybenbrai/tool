"use client";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ExportPanelProps {
  exportContent: string;
}

export function ExportPanel({ exportContent }: ExportPanelProps) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${exportContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  }

  function handleExportPDF() {
    alert("PDF export coming soon!");
  }

  return (
    <div className="flex gap-2 mb-4">
      <Button type="button" variant="secondary" onClick={handlePrint}>
        Print
      </Button>
      <Button type="button" variant="secondary" onClick={handleCopyLink}>
        Copy Link
      </Button>
      <Button type="button" variant="secondary" onClick={handleExportPDF}>
        Export PDF
      </Button>
    </div>
  );
}
