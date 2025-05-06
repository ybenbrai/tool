// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";

const REPLICATE_API_TOKEN = "r8_7KKPTZMEKuzyRardZXFXTJqFrIeP7tf02HOaS";
const MODEL_VERSION =
  "3e134907032b4e848eec7aa1e1f27cfa79231b44e033a623c3f638be1cead26d";

export async function POST(req: NextRequest) {
  const { image } = await req.json();

  const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: MODEL_VERSION,
      input: { image },
    }),
  });

  const prediction = await replicateRes.json();
  return NextResponse.json(prediction);
}
