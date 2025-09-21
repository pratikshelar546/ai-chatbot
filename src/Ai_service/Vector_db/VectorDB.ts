import vectorClient from "../../database/qdrant";

const createVectorDB = async () => {
  try {
      await vectorClient.createCollection("systemdesign", {
          vectors: {
            size: Number(process.env.OPENAI_EMBEDDING_MODEL_SIZE) || 1536,
            distance: "Cosine",
          },  
        });
    console.log("vector db created");
    return true;
  } catch (error:any) {
      console.log("error in creating vector db",error);
      return null;
  }
  }

const findCollectionOrCreate = async () => {
  try {
    const findCollectionExists = await vectorClient.getCollection("systemdesign");
    if(findCollectionExists){
      return true;
    
    }
  } catch (error:any) {
      if (error.status === 404) {
        console.log("Collection not found. Creating new collection...");
    
       await createVectorDB();
      } else {
        console.error("Unexpected error while checking collection:", error);
        return null;
      }
    }
  }

  export const storeData = async (embeddings:any)=>{
    try {
       await findCollectionOrCreate();
      for(const embedding of embeddings){
        await vectorClient.upsert("systemdesign", {
          points: [embedding],
        });
      }
      return true;
    } catch (error:any) {
      console.log("error in storing data",error);
      return null;

    }
  }







export default findCollectionOrCreate;