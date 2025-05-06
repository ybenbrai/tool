"use client";
import * as React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface FileDropInputProps {
  label: string;
  onTextLoaded: (text: string) => void;
}

export function FileDropInput({ label, onTextLoaded }: FileDropInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      onTextLoaded(e.target?.result as string);
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
        dragActive ? "border-primary bg-accent/40" : "border-border bg-muted/40"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={handleDrop}
      tabIndex={0}
      aria-label={label}
      role="button"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.json"
        className="hidden"
        onChange={handleChange}
        tabIndex={-1}
      />
      <div className="flex flex-col items-center gap-2">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          Drag & drop or click to upload (.txt, .md, .json)
        </span>
        {fileName && (
          <span className="text-xs text-primary">Loaded: {fileName}</span>
        )}
        <Button
          type="button"
          variant="secondary"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose File
        </Button>
      </div>
    </div>
  );
}
