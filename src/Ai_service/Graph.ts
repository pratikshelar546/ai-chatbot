import { END, START, StateGraph } from "@langchain/langgraph";
import messageState from "./state";
import { ragNode } from "./nodes/RagNode";


const graph = new StateGraph(messageState)
.addNode("ragNode",ragNode)
.addEdge(START,"ragNode")
.addEdge("ragNode",END)
.compile();



export default graph;