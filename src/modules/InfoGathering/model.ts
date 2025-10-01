import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema({
source:{
    type:String,
    required:true
},
content:{
    type:String,
    required:true
},
isDeleted:{
    type:Boolean,
    default:false
},
title:{
    type:String,

}
},{
    timestamps:true
})

export const knowledgeBaseModel = mongoose.model("KnowledgeBase", knowledgeBaseSchema);