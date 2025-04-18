import { Request, Response } from "express";
import { userService } from "../Service/userService";
import jsonwebtoken from "jsonwebtoken";

const healthCheck = (req: Request, res: Response): void => {
  res.json({ message: "everything is ok" });
};

const generateToken = (data: any) => {
  const sectetKey = process.env.SECRET_KEY ?? "secret_keyabc";
  return jsonwebtoken.sign(data, sectetKey, {
    expiresIn: "2h",
  });
};

const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { name, mailId, password } = req.body;

    const response: any = await userService.addUser(name, mailId, password);

    if (response) {
      const token = generateToken({
        name: response.name,
        userId: response._id,
      });
      res.json({
        success: true,
        message: "User Registered Successfully",
        token,
      });
    } else {
      res.json({ success: false, message: "something went wrong" });
    }
  } catch (error: any) {
    console.log("error in registeruser", error);

    if (error.code == "23505") {
      res.json({ success: false, message: "Mail Id Already Registered !" });
      return;
    }

    res.json({ success: false, message: error.message, error: error });
  }
};

const LoginUser = async (req: Request, res: Response) => {
  try {
    const { mailId, password } = req.body;

    console.log({ mailId, password });

    if (!mailId || !password) {
      res.json({ success: false, message: "Empty password or emailId" });
      return;
    }

    const response: any = await userService.findUser(mailId, password);

    if (response) {
      const token = generateToken({
        name: response.name,
        userId: response._id,
      });
      res.json({ success: true, message: "logged in succcessfully", token });
    } else {
      res.json({ success: false, message: "Wrong userid or Wrong password" });
    }
  } catch (error: any) {
    console.log("error in loginUser", error);
    res.json({ success: false, message: error.message, error: error });
  }
};

export const loginController = { RegisterUser, healthCheck, LoginUser };

// export default loginController;
