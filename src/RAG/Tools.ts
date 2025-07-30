import { Tool } from "langchain/tools";
import ollama from 'ollama';
import qdrantClient from "../database/qdrant";

export const searchTool = new Tool({
    name: "vector_search",
    description: "Use this to search relevant information from the knowledge base",
    func: async (query: string) => {
        const embedding = await ollama.embeddings({
            model: "nomic-embed-text",
            prompt: query,
        });

        const results = await qdrantClient.search("chatbot", {
            vector: embedding.embedding,
            limit: 5,
            score_threshold: 0.5,
        });

        return results
            .map((r: any) => r.payload?.text || "")
            .join("\n---\n");
    },
});