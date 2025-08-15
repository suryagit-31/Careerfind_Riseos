// server/ai/embeddings.js
import { pipeline } from "@xenova/transformers";

let extractorPromise = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractorPromise;
}

export async function embedText(text) {
  const extractor = await getExtractor();

  const output = await extractor(text, { pooling: "mean", normalize: true });
  // output.data is a Float32Array
  return output.data;
}
