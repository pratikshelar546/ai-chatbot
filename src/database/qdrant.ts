import { QdrantClient } from "@qdrant/js-client-rest";

 const vectorClient = new QdrantClient({
  url: "http://localhost:6333",
});

export default vectorClient;