
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import crypto from "crypto";
import { getEmbeddingModel } from "../Providers/EmbeddingModal";

export const createEmbedding = async (text: string, url: string) => {
    try {
        // splitter for documents
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        })

        let chunksWithMetadata = await splitter.createDocuments([text]);

        if (chunksWithMetadata.length > 0) {
            //add metadata for the chunks
            chunksWithMetadata = chunksWithMetadata.map(sentence => ({
                pageContent: sentence.pageContent,
                metadata: {
                    id: crypto.createHash('md5').update(sentence.pageContent).digest('hex'),
                    url: url,
                    data:sentence.pageContent
                }
            }));
        }
        // initialize the embedding model
        const embedding = await getEmbeddingModel();
        if(!embedding){
            throw new Error("Embedding model not found");
        }
        // create the embedding for the chunks
        const points = await Promise.all(chunksWithMetadata.map(async (chunk, index) => {
            try {
                const vector = await embedding.embedQuery(chunk.pageContent);
                if (!vector || vector.length !== 1536) {
                    throw new Error(`Invalid embedding at chunk ${index}`);
                }
                return {
                    id: chunk.metadata.id,
                    vector,
                    payload: chunk.metadata,
                }
            } catch (error:any) {
                console.error(`Embedding failed at chunk ${index}:`, error);
                return null; // skip bad chunk
            }
            }))

        // filter out the null chunks
        return points?.filter(p => p !== null);
    } catch (error) {
        console.log("error in creating embedding", error);
        return null;

    }
}
