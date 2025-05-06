"use client";
import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/ui/back-button";
import {
  DiffModeSelector,
  DiffMode,
} from "@/components/tools/text-comparator/DiffModeSelector";
import {
  SettingsPanel,
  ComparatorSettings,
} from "@/components/tools/text-comparator/SettingsPanel";
import { SimilarityStats } from "../../../components/tools/text-comparator/SimilarityStats";
import * as DiffLib from "diff";
import { FileDropInput } from "@/components/tools/text-comparator/FileDropInput";
import { ExportPanel } from "@/components/tools/text-comparator/ExportPanel";

const defaultSettings: ComparatorSettings = {
  ignoreCase: false,
  ignoreWhitespace: false,
  ignorePunctuation: false,
  addColor: "#bbf7d0",
  delColor: "#fecaca",
  changeColor: "#fef08a",
};

function preprocess(text: string, settings: ComparatorSettings) {
  let t = text;
  if (settings.ignoreCase) t = t.toLowerCase();
  if (settings.ignoreWhitespace) t = t.replace(/\s+/g, "");
  if (settings.ignorePunctuation)
    t = t.replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"]/g, "");
  return t;
}

function getDiff(
  a: string,
  b: string,
  mode: DiffMode,
  settings: ComparatorSettings
) {
  const textA = preprocess(a, settings);
  const textB = preprocess(b, settings);
  let diff;
  if (mode === "char") diff = DiffLib.diffChars(textA, textB);
  else if (mode === "word") diff = DiffLib.diffWords(textA, textB);
  else diff = DiffLib.diffLines(textA, textB);
  return diff;
}

function getStats(diff: DiffLib.Change[]): {
  add: number;
  del: number;
  change: number;
  similarity: number;
} {
  let add = 0,
    del = 0,
    change = 0,
    same = 0,
    total = 0;
  diff.forEach((d) => {
    if (d.added) add += d.count || 0;
    else if (d.removed) del += d.count || 0;
    else same += d.count || 0;
    total += d.count || 0;
  });
  // For simplicity, treat changes as min(add, del)
  change = Math.min(add, del);
  const similarity = total === 0 ? 100 : (same / total) * 100;
  return { add, del, change, similarity };
}

function renderDiff(diff: DiffLib.Change[], settings: ComparatorSettings) {
  return diff.map((part, i) => {
    let style = {};
    if (part.added) style = { background: settings.addColor };
    else if (part.removed) style = { background: settings.delColor };
    else if (!part.added && !part.removed && part.value.trim() !== "")
      style = {};
    return (
      <span key={i} style={style}>
        {part.value}
      </span>
    );
  });
}

export default function TextComparator() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [mode, setMode] = useState<DiffMode>("char");
  const [settings, setSettings] = useState<ComparatorSettings>(defaultSettings);

  const diff = useMemo(
    () => getDiff(textA, textB, mode, settings),
    [textA, textB, mode, settings]
  );
  const stats = useMemo(() => getStats(diff), [diff]);

  // For export, flatten diff to plain text
  const exportContent = useMemo(
    () => diff.map((d) => d.value).join(""),
    [diff]
  );

  return (
    <div className="max-w-4xl mx-auto py-12" aria-label="Text Comparator Tool">
      <BackButton />
      <h1 className="text-2xl font-bold mb-2">Text Comparator</h1>
      <p className="mb-6 text-muted-foreground">
        Compare two texts side by side and highlight differences in real time.
      </p>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span
          className="font-semibold"
          tabIndex={0}
          aria-label="Diff mode selector"
          title="Choose how to compare: character, word, or line"
        >
          Mode:
        </span>
        <DiffModeSelector mode={mode} onChange={setMode} />
      </div>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span
          className="font-semibold"
          tabIndex={0}
          aria-label="Settings panel"
          title="Customize comparison settings"
        >
          Settings:
        </span>
        <SettingsPanel settings={settings} onChange={setSettings} />
      </div>
      <SimilarityStats
        similarity={stats.similarity}
        add={stats.add}
        del={stats.del}
        change={stats.change}
      />
      <ExportPanel exportContent={exportContent} />
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        role="region"
        aria-label="Text input and diff results"
      >
        <div>
          <FileDropInput label="First text file" onTextLoaded={setTextA} />
          <Textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Enter first text..."
            aria-label="First text input"
          />
          <div
            className="mt-4 p-3 rounded bg-muted min-h-[48px] whitespace-pre-wrap break-words text-sm"
            aria-label="Diff result for first text"
          >
            {renderDiff(
              diff.filter((d) => !d.added),
              settings
            )}
          </div>
        </div>
        <div>
          <FileDropInput label="Second text file" onTextLoaded={setTextB} />
          <Textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Enter second text..."
            aria-label="Second text input"
          />
          <div
            className="mt-4 p-3 rounded bg-muted min-h-[48px] whitespace-pre-wrap break-words text-sm"
            aria-label="Diff result for second text"
          >
            {renderDiff(
              diff.filter((d) => !d.removed),
              settings
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-muted text-muted-foreground border border-border"
          aria-label="API access (coming soon)"
          title="API access for developers coming soon"
          disabled
        >
          API Access (Coming Soon)
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-muted text-muted-foreground border border-border"
          aria-label="Plugin support (coming soon)"
          title="Plugin support coming soon"
          disabled
        >
          Plugin Support (Coming Soon)
        </button>
      </div>
    </div>
  );
}
