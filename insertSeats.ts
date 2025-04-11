import { pool } from "./Entity/connectDb";

// Function to insert seats
const insertSeats = async () => {
  // Create an array of seat numbers (1 to 80)
  const seatNumbers = Array.from({ length: 80 }, (_, index) => index + 1);

  // Start a transaction to ensure all seats are inserted at once
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Begin the transaction

    // Insert each seat into the database
    for (let seatNumber of seatNumbers) {
      const query = `
        INSERT INTO seats (seat_number, booked)
        VALUES ($1, $2)
      `;
      await client.query(query, [seatNumber, false]); // Insert seat with booked = false
    }

    await client.query("COMMIT"); // Commit the transaction
    console.log("Seats inserted successfully!");
  } catch (err: any) {
    await client.query("ROLLBACK"); // If an error occurs, rollback the transaction
    console.error("Error inserting seats:", err.message);
  } finally {
    client.release(); // Release the client back to the pool
  }
};

const dropSeatsTable = async () => {
  const query = `DROP TABLE IF EXISTS seats CASCADE;`;

  try {
    // Execute the query to drop the table
    await pool.query(query);
    console.log("Seats table dropped successfully!");
  } catch (err: any) {
    console.error("Error dropping table:", err.message);
  }
};

// dropSeatsTable();

// // Call the function to insert seats
insertSeats();
