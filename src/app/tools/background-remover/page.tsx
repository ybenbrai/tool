"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { uploadFile } from "@uploadcare/upload-client";

const REPLICATE_API_TOKEN = "r8_7KKPTZMEKuzyRardZXFXTJqFrIeP7tf02HOaS";
const UPLOADCARE_PUBLIC_KEY = "12af1de8a57fb54b0236"; // replace with your real public key

async function uploadToUploadcare(file: File): Promise<string> {
  const result = await uploadFile(file, {
    publicKey: UPLOADCARE_PUBLIC_KEY,
    store: "auto",
  });

  return `https://ucarecdn.com/${result.uuid}/`;
}

async function removeBackground(file: File): Promise<string | null> {
  const imageUrl = await uploadToUploadcare(file);

  const response = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageUrl }),
  });

  if (!response.ok) {
    throw new Error("API error: " + response.statusText);
  }

  let prediction = await response.json();

  while (prediction.status !== "succeeded" && prediction.status !== "failed") {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
        },
      }
    );
    prediction = await poll.json();
  }

  if (prediction.status === "succeeded") {
    return prediction.output;
  }

  return null;
}

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRemove(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultUrl(null);
    if (!file) return;
    setLoading(true);
    try {
      const url = await removeBackground(file);
      if (url) setResultUrl(url);
      else setError("Background removal failed. Try another image.");
    } catch (err) {
      setError(
        "Error: " +
          ((err as Error).message.includes("Failed to fetch")
            ? "Could not connect to Replicate or Uploadcare. Check your keys and connection."
            : (err as Error).message)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Background Remover</h1>
      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleRemove}
      >
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button type="submit" disabled={!file || loading}>
          {loading ? "Removing..." : "Remove Background"}
        </Button>
      </form>
      <div className="mt-8 text-center text-muted-foreground">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {resultUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={resultUrl}
              alt="Result"
              className="rounded shadow"
              width={300}
              height={200}
            />
            <a
              href={resultUrl}
              className="underline text-primary"
              download="no-bg.png"
            >
              Download result
            </a>
          </div>
        ) : (
          <span>Upload an image and click Remove Background.</span>
        )}
      </div>
    </div>
  );
}
