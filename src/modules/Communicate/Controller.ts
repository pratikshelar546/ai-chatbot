import { Request, Response } from "express";
import ollama from "ollama";
import { qdrantClient } from "../../database/qdrant";
import axios from "axios";
import { createParser } from "eventsource-parser";

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    // Set headers for Server-Sent Events
    // res.writeHead(200, {
    //   "Content-Type": "text/event-stream",
    //   "Cache-Control": "no-cache",
    //   Connection: "keep-alive",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "Cache-Control",
    // });

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
        res.write(
          `data: I'm sorry, I don't have enough information to answer that.\n\n`
        );
        res.end();
        return;
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
                "respond in English",
            },  
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          stream: false,
        },
        // {
        //   responseType: "stream",
        // }
      );
      return res.status(200).json({
        message: "Response sent",
        data:
          response.data.message,
      });

      const parser = createParser({
        onEvent(event) {
          console.log(event, "event");

          if (event.data === "[DONE]") {
            console.log("done");
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }

          try {
            const parsed = JSON.parse(event.data);
            const text = parsed.response;
            console.log(`data: ${text}\n\n`);

            res.write(`data: ${text}\n\n`);
          } catch (err) {
            console.error("Chunk parse error:", err);
          }
        },
      });

      response.data.on("data", (chunk: any) => {
        parser.feed(chunk.toString());
        });

      response.data.on("end", () => {

        res.end();
      });

     
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
