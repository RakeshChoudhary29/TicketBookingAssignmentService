import { pool } from "../Entity/connectDb";

// ✅ Get all seats with optional user name
const getSeatsData = async () => {
  const query = `
    SELECT 
      seats.id,
      seats.seat_number,
      seats.booked,
      seats.booked_by,
      users.name AS booked_by_name
    FROM seats
    LEFT JOIN users ON seats.booked_by = users.id
    ORDER BY seat_number ASC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

// ✅ Book available seats
const bookSeats = async (seatsArr: number[], userId: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("1");

    // Lock and select the seats
    const selectQuery = `
      SELECT seat_number FROM seats
      WHERE seat_number = ANY($1::int[])
      AND booked = false
      FOR UPDATE;
    `;
    const selectResult = await client.query(selectQuery, [seatsArr]);
    const availableSeats = selectResult.rows.map((row: any) => row.seat_number);

    console.log("2");

    if (availableSeats.length !== seatsArr.length) {
      throw new Error("Some seats are already booked");
    }

    console.log({ seatsArr });

    // Update seats as booked
    const updateQuery = `
      UPDATE seats
      SET booked = true ,updated_at = NOW()
      WHERE seat_number = ANY($1::int[]);
    `;

    console.log("3");
    await client.query(updateQuery, [seatsArr]);
    console.log("4");

    await client.query("COMMIT");
    console.log("5");

    return { success: true, message: "Seats booked successfully" };
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", err.message);
    return { success: false, message: err.message, error: err };
  } finally {
    client.release();
  }
};

// ✅ Reset all seats to available
const resetSeats = async () => {
  const query = `
    UPDATE seats SET booked = false, booked_by = NULL, updated_at = NOW();
  `;

  try {
    await pool.query(query);
    return { success: true, message: "All seats have been reset" };
  } catch (err) {
    console.error("Failed to reset seats:", err);
    return { success: false, message: "Reset failed", error: err };
  }
};

export const seatsService = { getSeatsData, bookSeats, resetSeats };
