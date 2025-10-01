import { END, START, StateGraph } from "@langchain/langgraph";
import messageState from "./state";
import { ragNode } from "./nodes/RagNode";
import checkpoint from "./utils/CheckPoints.connection";


const graph = new StateGraph(messageState)
.addNode("ragNode",ragNode)
.addEdge(START,"ragNode")
.addEdge("ragNode",END)
.compile({ checkpointer: checkpoint });



export default graph;