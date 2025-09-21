import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
config();
let embeddingModal:OpenAIEmbeddings | null = null;
export const getEmbeddingModel = async () => {
try {
    if(!embeddingModal){
    const modelInstance = new OpenAIEmbeddings({
        apiKey: process.env.API_KEY,
        model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
        dimensions: Number(process.env.OPENAI_EMBEDDING_MODEL_SIZE) || 1536,
      });
      embeddingModal = modelInstance;
    }
    return embeddingModal;
} catch (error) {
    console.log(error,"error while getting embedding model");
    return null;
}
}