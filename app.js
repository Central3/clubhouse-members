import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import bcrypt from "bcryptjs";

import signUpRouter from "./routes/signUpRouter.js";
import loginRouter from "./routes/loginRouter.js";
import logoutRouter from "./routes/logoutRouter.js";
import pool from "./database/pool.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayouts);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("index", { user: req.user });
  }
  res.redirect("/log-in");
});
app.use("/sign-up", signUpRouter);
app.use("/log-in", loginRouter);
app.use("/log-out", logoutRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Example app listening on port ${PORT}`);
});
