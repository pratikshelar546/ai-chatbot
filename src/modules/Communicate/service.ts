import ollama from "ollama";
import { qdrantClient } from "../../database/qdrant";
import axios from "axios";
import { createParser } from "eventsource-parser";

export const questionAnswer = async (question: string) => {
  try {
    const embeddedQuestion = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: question,
    });

    const searchReleventText = await qdrantClient.search("chatbot", {
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

    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: "llama3",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant who only responds based on the provided context. If the context is missing or insufficient, reply with: 'I'm sorry, I don't have enough information to answer that.' Keep answers short and human-like.",
          },
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        stream: true,
      },
      {
        responseType: "stream",
      }
    );

        const parser = createParser((event:any):any => {
        if (event.data === '[DONE]') {
          res.write(`event: end\ndata: [DONE]\n\n`);
          res.end();
          return;
        }
  
        try {
          const parsed = JSON.parse(event.data);
          const text = parsed.response;
          res.write(`data: ${text}\n\n`);
        } catch (err) {
          console.error('Chunk parse error:', err);
        }
      });
  
      response.data.on('data', (chunk:any) => {
        parser.feed(chunk.toString());
      });
  
    response.data.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.log(error);
  }
};
