import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";

const client  =new MongoClient(process.env.MONGODB_URL || "mongodb://localhost:27017/systemdesign");

const checkpoint = new MongoDBSaver({ client })
export default checkpoint;