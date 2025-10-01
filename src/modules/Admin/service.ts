
import { userModel } from "./model";
import { User } from "./types";
// All logic and db call will be done from here only

export const findEmailAlreadyExist = async (
  email: string
): Promise<User | any> => {
  try {
    const emailExist = await userModel.findOne({email:email});
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
    const userExist = await userModel.findOne({phoneNumber:phoneNumber});
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
  phoneNumber,
}: User): Promise<any> => {
  try {
    const user = await userModel.create({
        name:name,
        email:email,
        password:password,
        phoneNumber: phoneNumber,
      
    });
    return user;
  } catch (error) {
    console.log("Error while creating user");
    throw error;
  }
};
