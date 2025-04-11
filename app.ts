import express from "express";
import { loginController } from "./Controller/login";
import { bookTickets, getTicketData, resetTickets } from "./Controller/Booking";
import cors from "cors";
import jwt from "jsonwebtoken";
import verifyToken from "./Middleware/authMiddleware";
import { connectDB } from "./Entity/connectDb";
import createSeatsTable from "./Entity/seats";
import createUserTable from "./Entity/User";

const { healthCheck, RegisterUser, LoginUser } = loginController;

const app = express();

app.use(cors());

// Or more secure version:
app.use(
  cors({
    origin: process.env.FRONT_END_URL, // allow only frontend origin
  })
);

app.use(express.json());

//connecting to the db
connectDB();
createUserTable();
createSeatsTable();

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
