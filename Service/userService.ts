import { pool } from "../Entity/connectDb";

// Add a new user to the database
const addUser = async (name: string, mailId: string, password: string) => {
  const query = `
    INSERT INTO users (name, mail_id, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, mail_id, created_at;
  `;

  const values = [name, mailId, password];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the created user
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Find a user by email and password
const findUser = async (mailId: string, password: string) => {
  const query = `
    SELECT * FROM users
    WHERE mail_id = $1 AND password = $2;
  `;

  const values = [mailId, password];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return found user or undefined
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

// Export the user service
export const userService = { addUser, findUser };
