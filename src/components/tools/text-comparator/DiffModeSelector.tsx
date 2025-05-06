import * as React from "react";

export type DiffMode = "char" | "word" | "line";

interface DiffModeSelectorProps {
  mode: DiffMode;
  onChange: (mode: DiffMode) => void;
}

const modes: { label: string; value: DiffMode }[] = [
  { label: "Character", value: "char" },
  { label: "Word", value: "word" },
  { label: "Line", value: "line" },
];

export function DiffModeSelector({ mode, onChange }: DiffModeSelectorProps) {
  return (
    <div className="flex gap-2 items-center mb-4">
      {modes.map((m) => (
        <button
          key={m.value}
          type="button"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            mode === m.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:bg-accent"
          }`}
          onClick={() => onChange(m.value)}
          aria-pressed={mode === m.value}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
