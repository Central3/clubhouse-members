import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import expressEjsLayouts from "express-ejs-layouts";

import signUpRouter from "./routes/signUpRouter.js";
import loginRouter from "./routes/loginRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayouts);

app.get("/", (req, res) => {
  res.redirect("/sign-up");
});
app.use("/sign-up", signUpRouter);
app.use("/log-in", loginRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Example app listening on port ${PORT}`);
});
