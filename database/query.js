import pool from "./pool.js";

async function registerUser(user, password) {
  const { first_name, last_name, username } = user;
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4);",
    [first_name, last_name, username, password]
  );
}

export { registerUser };
