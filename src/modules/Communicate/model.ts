import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role:{
        type:String,
        required:true,
        enum:["user","bot"]
    },
    content:{
        type:String,
        required:true
    },
},
{timestamps:true}   
)
const chatSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    messages:{
        type:[messageSchema],
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
)

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
