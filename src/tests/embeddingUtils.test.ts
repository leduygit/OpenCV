// /tests/embeddingUtils.test.ts
import { generateEmbedding } from "@/utils/embeddingUtils";

describe("generateEmbedding", () => {
  it("should generate embedding for given text", async () => {
    const text = "This is a sample text for testing.";
    const embedding = await generateEmbedding(text);
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
  });
});
