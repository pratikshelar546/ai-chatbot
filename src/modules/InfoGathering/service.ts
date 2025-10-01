import addKnowledgeBaseToDB from "../../Ai_service/knowledgeBase/AddKnowledgeBase";

import { knowledgeBaseModel } from "./model";
import { DataItem } from "./types";

export class InfoGatheringService {
 
  async addKnowledgeBaseToDB(text:string,url:string,title:string){
    const embeddings = await addKnowledgeBaseToDB(text,url);
    if(embeddings){
      const addKnowledgeToMongoDB = await knowledgeBaseModel.create({
        source:url,
        content:text,
        title:title
      })
      return addKnowledgeToMongoDB;
    }
    return null;
  }
}


