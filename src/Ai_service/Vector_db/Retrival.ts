
import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddingModel } from "../Providers/EmbeddingModal";

export const vectorRetrival = async (question:string)=>{
    try {
            const modelInstance = await getEmbeddingModel();
            if(!modelInstance){
                throw new Error("Embedding model not found");
            }
          const vectorStore = await QdrantVectorStore.fromExistingCollection(
            modelInstance,
            {
              url: process.env.QDRANT_URL || "http://localhost:6333",
              collectionName: 'systemdesign',
              contentPayloadKey: "text",
              metadataPayloadKey: "documentId",
            }
          );
          const retrival = vectorStore.asRetriever(4);
          const embeddings = await retrival.invoke(question);
          console.log(embeddings,"embeddings");
          
          return embeddings.map(doc => doc.pageContent).join("\n---\n");
    } catch (error) {
        console.log(error,"error while retriving data");
        return error;
    }
}