import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_TOKEN || "thisistoken";

interface decodedToken {
    id: string,
    email?: string
}

declare global {
    namespace Express {
        interface Request {
            user?: decodedToken
        }
    }
}

export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }
    const token = authToken.split(" ")[1];
    console.log(token);

    try {
        if (!token) return
        const decoded = jwt.verify(token, jwtSecret) as decodedToken;
        console.log(decoded, "decoded");

        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Somthing went wrong",
            success: false,
        });
    }
}