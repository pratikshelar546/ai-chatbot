import ollama from "ollama";
import qdrantClient from "../../database/qdrant";
import axios from "axios";
import { getResponse } from "../../Ai_service";
import Chat from "./model";

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

export const responseUserQuestion = async (question:string)=>{
  try {
    const response = await getResponse(question);
    return response;
    // return {
    //   messages: [],
    //   question: question,        
    //   response: '{\n' +
    //     '  "nodes": [\n' +
    //     '    { "id": "1", "type": "client", "label": "Web/Mobile App", "zone": { "x": 0, "y": 0 } },\n' +
    //     '    { "id": "2", "type": "load-balancer", "label": "Load Balancer", "zone": { "x": 1, "y": 2 } },\n' +
    //     '    { "id": "3", "type": "api-gateway", "label": "API Gateway", "zone": { "x": 3, "y": 2 } },\n' +
    //     '    { "id": "4", "type": "service", "label": "Investment Service", "zone": { "x": 0, "y": 4 } },\n' +
    //     '    { "id": "5", "type": "service", "label": "User Management Service", "zone": { "x": 1.5, "y": 4 } },\n' +
    //     '    { "id": "6", "type": "service", "label": "Transaction Service", "zone": { "x": 3, "y": 4 } },\n' +
    //     '    { "id": "7", "type": "service", "label": "Market Data Service", "zone": { "x": 4.5, "y": 4 } },\n' +
    //     '    { "id": "8", "type": "db", "label": "User Database", "zone": { "x": 1, "y": 6 } },\n' +
    //     '    { "id": "9", "type": "db", "label": "Transaction Database", "zone": { "x": 3, "y": 6 } },\n' +
    //     '    { "id": "10", "type": "cache", "label": "In-Memory Cache", "zone": { "x": 5, "y": 6 } }\n' +
    //     '  ],\n' +
    //     '  "edges": [\n' +
    //     '    { "source": "1", "target": "2", "label": "1. Static Assets" },\n' +
    //     '    { "source": "1", "target": "3", "label": "2. API Requests" },\n' +
    //     '    { "source": "2", "target": "4", "label": "3. Forward Requests" },\n' +
    //     '    { "source": "2", "target": "5", "label": "4. Forward Requests" },\n' +
    //     '    { "source": "2", "target": "6", "label": "5. Forward Requests" },\n' +
    //     '    { "source": "2", "target": "7", "label": "6. Forward Requests" },\n' +
    //     '    { "source": "4", "target": "9", "label": "7. Read/Write" },\n' +
    //     '    { "source": "5", "target": "8", "label": "8. Read/Write" },\n' +
    //     '    { "source": "6", "target": "9", "label": "9. Read/Write" },\n' +
    //     '    { "source": "7", "target": "10", "label": "10. Cache Data" }\n' +
    //     '  ]\n' +
    //     '}'
    // };
  } catch (error) {
    console.log(error);
    return "I'm sorry, something went wrong while processing your request.";
  }
}

export const storeChat = async (userId:string,question:string,response:string)=>{
  try {
    // Try to find an existing chat for the user
    let chat = await Chat.findOne({ userId, isDeleted: false });
    if (chat) {
      chat.messages.push(
        { role: "user", content: question },
        { role: "bot", content: response }
      );
    } else {
      // If no chat exists, create a new one
      chat = new Chat({
        userId,
        messages: [
          { role: "user", content: question },
          { role: "bot", content: response }
        ]
      });
    }
    await chat.save();
    return chat;
  } catch (error) {
    throw error;
  }
}
