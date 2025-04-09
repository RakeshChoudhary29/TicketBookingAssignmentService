import express from "express";
import healthCheck from "./Controller/login.ts";

const app = express();

// defind routes
app.get("/", healthCheck);

app.post("/register", ResiterUser);
app.post("/login", LoginUser);
app.post("/logout", LogoutUser);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server lisning at", port);
});
