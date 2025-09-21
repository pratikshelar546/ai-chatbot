import graph from "./Graph";

export const getResponse = async(question:string)=>{
    try {
        const response = await graph.invoke({question:question});
        console.log(response,"response from graph");
        
        return response
    } catch (error) {
        console.log(error,"error in getResponse",error);
        return error
    }
}