"use client";
import Link from "next/link";
import { ArrowRight, FileText, FileUp, Image as ImageIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const tools = [
  {
    name: "Text Comparator",
    description: "Compare two texts side by side and highlight differences.",
    href: "/tools/text-comparator",
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
  {
    name: "File Converter",
    description: "Convert PDF, images, or docs to other formats.",
    href: "/tools/file-converter",
    icon: <FileUp className="w-6 h-6 text-primary" />,
  },
  {
    name: "Background Remover",
    description: "Remove the background from any image.",
    href: "/tools/background-remover",
    icon: <ImageIcon className="w-6 h-6 text-primary" />,
  },
  {
    name: "Common Internet Tools",
    description: "A curated list of popular online tools (free, paid, login).",
    href: "/tools/common-internet-tools",
    icon: <ArrowRight className="w-6 h-6 text-primary" />,
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Nav */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border/40">
        <span className="font-bold text-lg tracking-tight">
          Swiss Army Tools
        </span>
        <ThemeToggle />
      </header>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            Swiss Army Tools for Developers & Creators
          </h1>
          <p className="text-lg text-muted-foreground mb-6 text-center max-w-xl">
            A growing collection of fast, elegant, and useful tools for your
            daily workflow.
          </p>
          <div className="w-full max-w-xl mb-10">
            <Input
              type="search"
              placeholder="Search tools..."
              className="text-lg px-5 py-4 shadow-md border-2 border-border focus:border-primary transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl max-h-[340px]">
          {filteredTools.length === 0 ? (
            <div className="col-span-full flex items-center justify-center min-h-[180px] text-center text-muted-foreground">
              No tools found.
            </div>
          ) : (
            filteredTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group rounded-2xl bg-card shadow-lg hover:shadow-xl transition p-6 flex flex-col gap-3 border border-border/30 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[180px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  {tool.icon}
                  <span className="font-semibold text-lg">{tool.name}</span>
                </div>
                <p className="text-muted-foreground text-sm flex-1">
                  {tool.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-primary font-medium text-sm opacity-80 group-hover:opacity-100 transition">
                  Open <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40">
        &copy; {new Date().getFullYear()} Swiss Army Tools. Built with Next.js,
        Tailwind CSS, and shadcn/ui.
      </footer>
    </div>
  );
}
