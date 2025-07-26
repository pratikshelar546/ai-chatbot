import prismaClient from "../../database/client";
import { User } from "./types";
// All logic and db call will be done from here only

export const findEmailAlreadyExist = async (
  email: string
): Promise<User | any> => {
  try {
    const emailExist = await prismaClient.admin.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        password: true,
        updatedAt: true,
      },
    });
    return emailExist;
  } catch (error) {
    console.log("Error while finding email in db");
    throw error;
  }
};

export const findUserByPhoneNumber = async (
  phoneNumber: string
): Promise<User | any> => {
  console.log("finding by phone", phoneNumber);

  try {
    const userExist = await prismaClient.admin.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return userExist;
  } catch (error) {
    console.log("Error while finding email in db");
    throw error;
  }
};

export const addUser = async ({
  name,
  email,
  password, 
}: User): Promise<any> => {
  try {
    const user = prismaClient.admin.create({
      data: {
        name,
        email,
        password,
        phoneNumber: "",
      },
    });
    return user;
  } catch (error) {
    console.log("Error while creating user");
    throw error;
  }
};
