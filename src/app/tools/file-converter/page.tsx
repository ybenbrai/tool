"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

import { jsPDF } from "jspdf";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, Media } from "docx";

async function convertImage(file: File, format: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => resolve(blob),
        format === "jpg" ? "image/jpeg" : "image/png"
      );
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

async function convertImageToPDF(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "l" : "p",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
      resolve(pdf.output("blob"));
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

async function convertPDFtoPNG(file: File): Promise<Blob | null> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function convertDocxToText(file: File): Promise<string | null> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}

async function convertDocxToPDF(file: File): Promise<Blob | null> {
  const text = await convertDocxToText(file);
  if (!text) return null;
  const pdf = new jsPDF();
  pdf.text(text, 10, 10);
  return pdf.output("blob");
}

async function convertImageToDocx(file: File): Promise<Blob | null> {
  const imageBuffer: ArrayBuffer = await file.arrayBuffer();
  // @ts-expect-error docx types are incomplete for Media.addImage
  const image = Media.addImage(new Document(), imageBuffer);
  const doc = new Document({
    sections: [
      {
        children: [new Paragraph({ children: [image] })],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  return blob;
}

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("");
  const [converted, setConverted] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConverted(null);
    if (!file || !format) return;
    setLoading(true);
    try {
      let result: Blob | null = null;
      if (file.type.startsWith("image/")) {
        if (format === "png" || format === "jpg") {
          result = await convertImage(file, format);
        } else if (format === "pdf") {
          result = await convertImageToPDF(file);
        } else if (format === "docx") {
          result = await convertImageToDocx(file);
        }
      } else if (file.type === "application/pdf") {
        if (format === "png") {
          result = await convertPDFtoPNG(file);
        } else if (format === "docx") {
          // PDF to DOCX: extract text and create DOCX
          // @ts-expect-error pdfjs-dist types are incomplete for legacy import
          const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text +=
              (content.items as { str: string }[])
                .map((item) => item.str)
                .join(" ") + "\n";
          }
          const doc = new Document({
            sections: [
              {
                children: [new Paragraph(text)],
              },
            ],
          });
          result = await Packer.toBlob(doc);
        }
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        if (format === "pdf") {
          result = await convertDocxToPDF(file);
        } else if (format === "docx") {
          // Just return the file itself
          result = file;
        }
      }
      if (result) setConverted(result);
      else
        setError(
          "This conversion is not supported yet. Supported: image <-> PNG/JPG/PDF/DOCX, PDF <-> PNG/DOCX, DOCX <-> PDF."
        );
    } catch (err) {
      setError("Error during conversion: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">File Converter</h1>
      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleConvert}
      >
        <Input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="">Select target format</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </Select>
        <Button type="submit" disabled={!file || !format || loading}>
          {loading ? "Converting..." : "Convert"}
        </Button>
      </form>
      <div className="mt-8 text-center text-muted-foreground">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {converted ? (
          <a
            href={URL.createObjectURL(converted)}
            className="underline text-primary"
            download={`converted.${format}`}
          >
            Download converted file
          </a>
        ) : (
          <span>
            Supported: image &lt;-&gt; PNG/JPG/PDF/DOCX, PDF &lt;-&gt; PNG/DOCX,
            DOCX &lt;-&gt; PDF. More coming soon.
          </span>
        )}
      </div>
    </div>
  );
}
