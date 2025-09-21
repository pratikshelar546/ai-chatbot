import { Request, Response } from "express";

import { getResponse } from "../../Ai_service";

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    console.log(question,"question");

    

    // Set headers for Server-Sent Events
    // res.writeHead(200, {
    //   "Content-Type": "text/event-stream",
    //   "Cache-Control": "no-cache",
    //   Connection: "keep-alive",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "Cache-Control",
    // });
    // const updatedQuestion = JSON.parse(question)
   const reposne = await getResponse(question)  
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
