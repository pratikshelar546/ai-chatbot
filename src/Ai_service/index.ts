import graph from "./Graph";

export const getResponse = async(question:string)=>{
    try {
        const response = await graph.invoke(
            { question: question },
            {configurable:{ thread_id: "1" }}
        );
        
        return response
    } catch (error) {
        console.log(error,"error in getResponse",error);
        return error
    }
}