import { Pool } from "pg";

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

export default new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
});
