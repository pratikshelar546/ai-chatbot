import fs from "fs";
import PdfParse from "pdf-parse";
import ollama from "ollama";
import { qdrantClient } from "../../database/qdrant";
import { v4 as uuidv4 } from 'uuid';

export const readFromPdf = async (path: string) => {
  console.log(path, "path");
  try {
    const pdfData = fs.readFileSync(path);
    const pdfParse = await PdfParse(pdfData);

    const sentences = pdfParse.text.split(/(?<=[.?!])\s+/);
    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      if ((current + sentence).length < 500) {
        current += sentence + " ";
      } else {
        chunks.push(current.trim());
        current = sentence + " ";
      }
    }

    if (current.length > 0) {
      chunks.push(current.trim());
    }


    const points = await Promise.all(
      chunks.map(async (chunk, index) => {
        try {
          const embeddingResponse = await ollama.embeddings({
            model: "nomic-embed-text",
            prompt: chunk,
          });
    
          const vector = embeddingResponse?.embedding;
    
          if (!vector || vector.length !== 768) {
            throw new Error(`Invalid embedding at chunk ${index}`);
          }
    
          return {
            id: uuidv4(), // Qdrant expects string or number, better to stringify
            vector,
            payload: {
              text: chunk,
              source: path,
            },
          };
        } catch (err) {
          console.error(`Embedding failed at chunk ${index}:`, err);
          return null; // skip bad chunk
        }
      })
    );
    
    // Filter out nulls
    const validPoints = points.filter(p => p !== null);
    
    const addData = await qdrantClient.upsert("chatbot", {
      wait: true,
      points: validPoints,
    });

    // delete the file from the server
    fs.unlinkSync(path);
  } catch (error) {
    console.log(error);
  }
};
