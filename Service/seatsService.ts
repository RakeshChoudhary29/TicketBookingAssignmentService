import mongoose from "mongoose";
import Seats from "../Entity/seats";

const getSeatsData = () => {
  return Seats.find();
};

const bookSeats = async (seatsArr: number[], userId: string) => {
  //   const session = await mongoose.startSession();

  try {
    // session.startTransaction();

    const updateResults = await Seats.updateMany(
      {
        seatNumber: { $in: seatsArr },
        booked: { $ne: true },
      },
      { $set: { booked: true } }
      //   { session }
    );

    // if (updateResults.length !== seatsArr.length) {
    //   throw new Error("Some seats are already booked");
    // }

    // await session.commitTransaction();
    // session.endSession();
    return { success: true, message: "Seats booked Successfully" };
  } catch (err: any) {
    console.error("Transaction failed:", err.message);
    // await session.abortTransaction();
    // session.endSession();
    return { success: false, message: err.message, error: err };
  }
};

const resetSeats = async () => {
  return Seats.updateMany({}, { $set: { booked: false } });
};

export const seatsService = { getSeatsData, bookSeats, resetSeats };
