import { Client } from "pg";
import { readFileSync } from "node:fs";
import path from "node:path";

const filePath = process.argv[2];
const sql = readFileSync(filePath, "utf-8");
const fileName = path.basename(filePath);

async function main() {
  console.log(`🚀 Preparing to execute: ${fileName}`);

  const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

  const client = new Client({
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
  });

  await client.connect();
  console.log("✅ Connected to database. Executing SQL....");
  await client.query(sql);
  console.log("🍾 Execution finished successfully!");
  await client.end();
}

main();
