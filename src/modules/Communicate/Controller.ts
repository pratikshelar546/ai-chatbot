import { Request, Response } from "express";

import { getResponse } from "../../Ai_service";
import { responseUserQuestion, storeChat } from "./service";

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    console.log(question,"question");
const userId = req.body.userId || "68dd809bb902f94db3ace1fc";
    

    // Set headers for Server-Sent Events
    // res.writeHead(200, {
    //   "Content-Type": "text/event-stream",
    //   "Cache-Control": "no-cache",
    //   Connection: "keep-alive",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "Cache-Control",
    // });
    // const updatedQuestion = JSON.parse(question)
   const reposne = await responseUserQuestion(question) as {response:string};
   console.log(reposne,"reposne from fuck");
   
   await storeChat(userId,question,reposne.response);
   
   res.status(200).json({
    message: reposne,
   })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
