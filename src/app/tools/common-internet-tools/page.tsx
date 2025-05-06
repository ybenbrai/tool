import { Card } from "@/components/ui/card";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

const internetTools = [
  {
    name: "PDF Merge",
    description: "Merge multiple PDFs into one.",
    url: "https://www.ilovepdf.com/merge_pdf",
    paid: false,
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes for URLs, text, and more.",
    url: "https://www.qr-code-generator.com/",
    paid: false,
  },
  {
    name: "Password Manager (1Password)",
    description: "Securely store and manage your passwords.",
    url: "https://1password.com/",
    paid: true,
    login: true,
  },
  {
    name: "AI Chat (ChatGPT)",
    description: "Conversational AI assistant.",
    url: "https://chat.openai.com/",
    paid: false,
    login: true,
  },
  {
    name: "Canva",
    description: "Design graphics, presentations, and more.",
    url: "https://www.canva.com/",
    paid: true,
    login: true,
  },
  {
    name: "TinyPNG",
    description: "Compress PNG and JPG images online.",
    url: "https://tinypng.com/",
    paid: false,
  },
];

export default function CommonInternetTools() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Common Internet Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {internetTools.map((tool) => (
          <Card key={tool.name} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{tool.name}</span>
              {tool.paid && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-200 text-yellow-900">
                  Paid
                </span>
              )}
              {tool.login && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-200 text-blue-900">
                  Login
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{tool.description}</p>
            <Link
              href={tool.url}
              target="_blank"
              className="text-primary underline mt-2"
            >
              Visit
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
