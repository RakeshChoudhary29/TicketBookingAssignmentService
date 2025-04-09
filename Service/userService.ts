import User from "../Entity/User";

const addUser = (name: string, emailId: string, password: string) => {
  return User.insertOne({ name, emailId, password });
};

const findUser = (emailId: string, password: string) => {
  return User.find({ emailId, password });
};

export const userService = { addUser, findUser };
