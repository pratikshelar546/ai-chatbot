import { Router } from "express";
import { askQuestion, fetchChats } from "./Controller";
import { authenticateUser } from "../../middleware/verifyUser";

const router = Router();

router.post("/ask", askQuestion);
router.get("/chats/:userId",fetchChats)
export default router;
