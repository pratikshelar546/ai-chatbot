import ollama from "ollama";
import qdrantClient from "../../database/qdrant";
import axios from "axios";

/**
 * Answers a question using context retrieved from the vector database.
 * Returns a string answer.
 */
export const questionAnswer = async (question: string): Promise<string> => {
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

   return ""
  } catch (error) {
    console.log(error);
    return "I'm sorry, something went wrong while processing your request.";
  }
};
