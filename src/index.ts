import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fs from "fs";
const app = express();
const port = 5001;
import path from "path";
import PdfParse from "pdf-parse";
import ollama from "ollama";
import { QdrantClient } from "@qdrant/js-client-rest";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

const client = new QdrantClient({
  url: "http://localhost:6333",
});

// const createCollection = async () => {
//   const collecttion = client.createCollection("chatbot", {
//     vectors: {
//       size: 768,
//       distance: "Cosine",
//     },
//   });
//   console.log(collecttion);
// };
// console.log(createCollection);
// createCollection();

// const readFromPdf = async () => {
//   try {
//     const pdfData = fs.readFileSync(__dirname + "/doc/learn.pdf");
//     const pdfParse = await PdfParse(pdfData);

//     const sentences = pdfParse.text.split(/(?<=[.?!])\s+/);
//     const chunks: string[] = [];
//     let current = "";

//     for (const sentence of sentences) {
//       if ((current + sentence).length < 500) {
//         current += sentence + " ";
//       } else {
//         chunks.push(current.trim());
//         current = sentence + " ";
//       }
//     }

//     if (current.length > 0) {
//       chunks.push(current.trim());
//     }

//     console.log(chunks);

//     const points = await Promise.all(
//       chunks.map(async (chunk, index) => {
//         const embediing = await ollama.embeddings({
//           model: "nomic-embed-text",
//           prompt: chunk,
//         });

//         return {
//           id: index,
//           vector: embediing.embedding,
//           payload: {
//             text: chunk,
//             source: "learn.pdf",
//           },
//         };
//       })
//     );

//     const addData = await client.upsert("chatbot", {
//       wait: true,
//       points,
//     });

//     console.log(addData, "aded data");
//   } catch (error) {
//     console.log(error);
//   }
// };
// readFromPdf();
const questionAnswer = async (question: string) => {
  try {
    const embeddedQuestion = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: question,
    });

    const searchReleventText = await client.search("chatbot", {
      vector: embeddedQuestion.embedding,
      limit: 10,
      score_threshold: 0.5,
    });

    // console.log(searchReleventText);

    const context = searchReleventText
      .map((result) => result.payload?.text || result.payload?.pdf || "")
      .join("\n");

    if (!context || context.length === 0) {
      return "I'm sorry, I don't have enough information to answer that.";
    }

    const finalPrompt = `
    You are a helpful assistant. Based only on the information in the context below, answer the user's question in a natural, human-like tone.

    If the context does not contain enough information to answer the question, simply reply with: "I'm sorry, I don't have enough information to answer that."

    Do not mention that you are an AI or assistant. Do not add extra explanations. Be brief, clear, and human-like in your response.
    Keep your answer short, precise, and to the point—no fluff, just the essential information.

    Context:
    ${context}

    Question:
    ${question}
    `;
    console.log(question, "question is asked waiting for response");

    // continue with the API call
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant who only responds based on the provided context. If the context is missing or insufficient, reply with: 'I'm sorry, I don't have enough information to answer that.' Keep answers short and human-like.",
        },
        {
          role: "user",
          content: finalPrompt, // ✅ this includes both context and question
        },
      ],
      stream: false,
    });

    console.log("repose is there -------------------------------------------");
    console.log("Answer:", response.data.message);
    return response.data.response;
  } catch (error) {
    console.log(error);
  }
};

import infoGatheringRouter from "./modules/InfoGathering/Controller";
import adminRouter from "./modules/Admin/route";
import communicateRouter from "./modules/Communicate/Route";

app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/chatbot/api/v1/info", infoGatheringRouter);
app.use("/chatbot/api/v1/admin", adminRouter);
app.use("/chatbot/api/v1/communicate", communicateRouter);
// readFromPdf()
// const answer = questionAnswer("share social media links").then((data) => {
//   console.log(data, "data");
// });

app.listen(port, () => {
  console.info("sever is running on ", port);
});
