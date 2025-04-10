import { Request, Response } from "express";
import { userService } from "../Service/userService";

const healthCheck = (req: Request, res: Response): void => {
  res.json({ message: "everything is ok" });
};

const ResiterUser = async (req: Request, res: Response) => {
  try {
    const { name, mailId, password } = req.body;

    console.log({ name, mailId, password });

    const response: any = await userService.addUser(name, mailId, password);

    if (response) {
      res.json({
        success: true,
        message: "User Registered Successfully",
      });
    } else {
      res.json({ success: false, message: "something went wrong" });
    }
  } catch (error: any) {
    console.log("error in registeruser", error);
    res.json({ success: false, message: error.message, error: error });
  }
};

const LoginUser = async (req: Request, res: Response) => {
  try {
    const { emailId, password } = req.body;

    const response: any = await userService.findUser(emailId, password);

    console.log(response);

    if (response) {
      res.json({ success: true, message: "logged in succcessfully" });
    } else {
      res.json({ success: false, message: "Wrong userid or password" });
    }
  } catch (error: any) {
    console.log("error in loginUser", error);
    res.json({ success: false, message: error.message, error: error });
  }
};

export const loginController = { ResiterUser, healthCheck, LoginUser };

// export default loginController;
