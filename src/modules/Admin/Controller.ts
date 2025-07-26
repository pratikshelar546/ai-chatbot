// Api will be written here and all logic and db call will done in service.ts only
// comman type will be wrritten in types.ts
// routes will be wrriten in index.ts

import { NextFunction, Request, Response } from "express";
import { User } from "./types";
import {
  addUser,
  findEmailAlreadyExist,
  findUserByPhoneNumber,
} from "./service";
import { compareHashPassword, genrateJwtToken, hashPassword } from "./utils";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, name, phoneNumber, password }: User = req.body;

    const userAlreadyExits = await findEmailAlreadyExist(email);
    if (userAlreadyExits)
      return res.status(400).json({
        message: "User with this email already exist",
        success: false,
      });

    const hashedPassword = await hashPassword(password);

    const user = await addUser({
      name,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    if (!user)
      return res.status(400).json({
        message: "Not able to create user",
        success: false,
      });

    // const token = genrateJwtToken(user);
    return res.status(200).json({
      message: "User created successfully",
      success: true,
      user,
    });
  } catch (error: any) {
    console.log("Error while creating user", error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // creadetials can be phone number or email
    const { creadntials, password } = req.body;
    const user = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creadntials)
      ? await findEmailAlreadyExist(creadntials)
      : ((await findUserByPhoneNumber(creadntials)) as User | any);

    if (!user)
      return res.status(404).json({
        message: "User not found with this creadentials",
        success: false,
      });

    const passwordMatched = await compareHashPassword(password, user.password);
    if (!passwordMatched)
      return res.status(401).json({
        message: "Creadentials did not matched",
        success: false,
      });

    const token = genrateJwtToken(user) as string;

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
