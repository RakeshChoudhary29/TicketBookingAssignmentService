import express from "express";
import connectDB from "./Entity/connectDb";
import { loginController } from "./Controller/login";
import { bookTickets, getTicketData, resetTickets } from "./Controller/Booking";
import cors from "cors";
import jwt from "jsonwebtoken";
import verifyToken from "./Middleware/authMiddleware";

const { healthCheck, RegisterUser, LoginUser } = loginController;

const app = express();

app.use(cors());

// Or more secure version:
app.use(
  cors({
    origin: "http://localhost:5173", // allow only frontend origin
  })
);

app.use(express.json());

//connecting to the db
connectDB();

// defind routes
app.get("/", healthCheck);

app.post("/register", RegisterUser);
app.post("/login", LoginUser);
// app.post("/logout", LogoutUser);

app.use(verifyToken);

// ticket booking apis

app.get("/get-ticket-data", getTicketData);
app.post("/book-tickets", bookTickets);
app.post("/reset-tickets", resetTickets);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server lisning at", port);
});
