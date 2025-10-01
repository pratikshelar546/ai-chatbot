import { systemPrompt } from "../Providers/System_prompt";
import { vectorRetrival } from "../Vector_db/Retrival";
import getLLM from "../Providers/LLMProvider";


export const ragNode = async (state:any)=>{
const llm = getLLM();
try {
    const {question} = state;
    const stringQuestion = JSON.stringify(question);
    const context = await vectorRetrival(stringQuestion) as string;
   
    const prompt = systemPrompt(context)
   
    const message =[
        {
            role:"system",
            content:prompt
        },
        {
            role:"user",
            content:`
            Question: ${question}
            Context: ${context}
            `
        }
    ]

    const response = await llm.invoke(message);
    
    const messages = [
    {
        role:"user",
        question:question
    },{
        role:"bot",
        response:response.content
    }
    ]
    return {response:response.content,messages:messages}
} catch (error) {
    console.log(error,"error in ragNode",error);
    return error
    
}
}