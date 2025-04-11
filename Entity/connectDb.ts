// db.ts
import { Pool } from "pg";
import "dotenv/config";

// Get the PostgreSQL connection string from environment variables
const pgUrl: string =
  process.env.PSQLURL ?? "postgresql://localhost:5432/your_db_name";

console.log({ pgUrl });

// Create a new pool (connection pool) for PostgreSQL
const pool = new Pool({
  connectionString: pgUrl,
  ssl: { rejectUnauthorized: false },
  // process.env.NODE_ENV === "production"
  //   ? { rejectUnauthorized: false }
  //   : false, // Only needed if using SSL in production
});

// Connect to the PostgreSQL database
const connectDB = async () => {
  try {
    await pool.connect();
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export { connectDB, pool };
