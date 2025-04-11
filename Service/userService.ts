import User from "../Entity/User";

const addUser = (name: string, mailId: string, password: string) => {
  return User.insertOne({ name, mailId, password });
};

const findUser = (mailId: string, password: string) => {
  return User.findOne({ mailId, password });
};

export const userService = { addUser, findUser };
