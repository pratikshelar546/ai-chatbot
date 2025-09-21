import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();
let llmInstance:any = null;

const getLLM = () => {
    try {
        if (!llmInstance ) {
            llmInstance = new ChatOpenAI({
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            apiKey: process.env.API_KEY,
            temperature: 0.5,
            maxTokens: 1000,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
        });
    }
    return llmInstance;
} catch (error) {
    console.log("failed while connecting to llm");
    console.log(error);
    return null;
}
};


export default getLLM
