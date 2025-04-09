import express from "express";
import connectDB from "./Entity/connectDb";
import { loginController } from "./Controller/login";

// const { healthCheck, ResiterUser, LoginUser } = loginController;

const app = express();

//connecting to the db
connectDB();

// defind routes
// app.get("/", healthCheck);

// app.post("/register", ResiterUser);
// app.post("/login", LoginUser);
// app.post("/logout", LogoutUser);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server lisning at", port);
});
