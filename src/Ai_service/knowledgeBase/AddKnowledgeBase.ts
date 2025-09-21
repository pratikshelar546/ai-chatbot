import { createEmbedding } from "../embedding/CreateEmbedding";
import { storeData } from "../Vector_db/VectorDB";

const addKnowledgeBaseToDB = async(text:string,url:string)=>{
    try {
        const embeddings = await createEmbedding(text,url);
        
         if(embeddings){            
            const storeDataResult = await storeData(embeddings);
            return storeDataResult;
         }
         return null;
    } catch (error) {
        console.log("error in adding knowledge base to db",error);
        return null;        
    }
}

export default addKnowledgeBaseToDB;