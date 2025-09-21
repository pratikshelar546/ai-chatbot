import { Annotation } from "@langchain/langgraph";

const messageState = Annotation.Root({
    messages: Annotation<string[]>({
        value: (left: any[], right: any[]) => [...left, ...right],
        default: () => [],
    }),
    question: Annotation<string>,
    userDesign: Annotation<object>,
    response:Annotation<string>,

})


export default messageState;