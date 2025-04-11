import { pool } from "./connectDb";

const createSeatsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS seats (
      id SERIAL PRIMARY KEY,
      booked BOOLEAN DEFAULT FALSE,
      seat_number INTEGER NOT NULL,
      booked_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ 'seats' table created successfully!");
  } catch (err) {
    console.error("❌ Error creating 'seats' table:", err);
  }
};

export default createSeatsTable;
