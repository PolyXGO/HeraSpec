/**
 * HeraSpec Memory Vector Search
 * Handles embedding generation and cosine similarity search using @xenova/transformers
 */
import { pipeline } from '@xenova/transformers';
import type { Observation, MemorySearchResult } from './memory-types.js';
import { OBSERVATION_TYPE_ICONS, estimateTokens } from './memory-types.js';

export class MemoryVector {
  private static extractor: any = null;

  /**
   * Initialize the embedding model.
   * This downloads the model on first run (cached in node_modules or system cache).
   */
  static async initModel() {
    if (!this.extractor) {
      // Use a lightweight, fast embedding model suitable for CLI
      this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return this.extractor;
  }

  /**
   * Generate an embedding vector for a given text.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const extractor = await this.initModel();
      // Generate sentence embeddings
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      // The output is a Tensor. We convert it to a standard JS array.
      return Array.from(output.data);
    } catch (error) {
      // console.warn('Failed to generate embedding:', error);
      return [];
    }
  }

  /**
   * Calculate Cosine Similarity between two vectors.
   * Returns a value between -1 and 1. Higher is more similar.
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Search through observations using semantic vector search.
   */
  static async search(query: string, observations: Observation[], limit: number = 10): Promise<MemorySearchResult[]> {
    if (observations.length === 0) return [];

    const queryEmbedding = await this.generateEmbedding(query);
    if (queryEmbedding.length === 0) {
      return []; // Fallback to FTS if embedding fails? Handled by caller.
    }

    const results: Array<{ obs: Observation; score: number }> = [];

    // Calculate similarity for each observation
    for (const obs of observations) {
      // Only rank observations that have an embedding
      if (obs.embedding && obs.embedding.length > 0) {
        const score = this.cosineSimilarity(queryEmbedding, obs.embedding);
        results.push({ obs, score });
      }
    }

    // Sort by descending score
    results.sort((a, b) => b.score - a.score);

    // Format as MemorySearchResult
    return results.slice(0, limit).map(({ obs, score }) => {
      return {
        id: obs.id,
        type: obs.type,
        title: obs.title,
        narrative: obs.narrative,
        concepts: obs.concepts || [],
        filesModified: obs.filesModified || [],
        createdAt: obs.createdAt,
        createdAtEpoch: obs.createdAtEpoch,
        rank: score, // Use score as rank for sorting/display
        estimatedTokens: estimateTokens(obs.narrative)
      };
    });
  }
}
