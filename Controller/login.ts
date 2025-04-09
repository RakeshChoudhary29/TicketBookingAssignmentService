import { Request, Response } from "express";
import { userService } from "../Service/userService";

const healthCheck = (req: Request, res: Response) => {
  return res.json({ message: "everything is ok" });
};

const ResiterUser = async (req: Request, res: Response) => {
  try {
    const { name, mailId, password } = req.body;

    console.log({ name, mailId, password });

    const response: any = await userService.addUser(name, mailId, password);

    if (response) {
      return res.json({
        success: true,
        message: "User Registered Successfully",
      });
    } else {
      return res.json({ success: false, message: "something went wrong" });
    }
  } catch (error: any) {
    console.log("error in registeruser", error);
    return res.json({ success: false, message: error.message, error: error });
  }
};

const LoginUser = async (req: Request, res: Response) => {
  try {
    const { emailId, password } = req.body;

    const response: any = await userService.findUser(emailId, password);

    console.log(response);

    if (response) {
      return res.json({ success: true, message: "logged in succcessfully" });
    } else {
      return res.json({ success: false, message: "Wrong userid or password" });
    }
  } catch (error: any) {
    console.log("error in loginUser", error);
    res.json({ success: false, message: error.message, error: error });
  }
};

export const loginController = { ResiterUser, healthCheck, LoginUser };

// export default loginController;
