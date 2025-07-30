import { Router } from "express";
import { askQuestion } from "./Controller";
import { authenticateUser } from "../../middleware/verifyUser";

const router = Router();

router.post("/ask", askQuestion);

export default router;
