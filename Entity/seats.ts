import mongoose from "mongoose";

const seatsSchema = new mongoose.Schema({
  booked: { type: Boolean, default: false },
  seatNumber: { type: Number, required: true },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId, // Define it as an ObjectId
    ref: "User", // Reference the User model
    required: true,
    default: "",
  },
});

const Seats = mongoose.model("Seats", seatsSchema);

export default Seats;
