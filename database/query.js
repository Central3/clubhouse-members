import pool from "./pool.js";

// User related queries
async function registerUser(user, password) {
  const { first_name, last_name, username } = user;
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4);",
    [first_name, last_name, username, password]
  );
}

// Message related queries
async function getAllMessages() {
  const messages = await pool.query(
    "SELECT message_id, title, content, created_at, username FROM messages JOIN users ON messages.user_id = users.id"
  );
  return messages.rows;
}

async function addMessage(message) {
  const { message_title: title, message_content: content, userId } = message;
  await pool.query(
    "INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)",
    [title, content, userId]
  );
}

export { registerUser, addMessage, getAllMessages };
