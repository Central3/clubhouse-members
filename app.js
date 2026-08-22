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
import newMessageRouter from "./routes/newMessageRouter.js";
import pool from "./database/pool.js";
import { getAllMessages } from "./database/query.js";

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

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
};

app.get("/", checkAuthenticated, async (req, res) => {
  let messages = await getAllMessages();
  const user = req.user;

  messages = messages.map((message) => {
    message.formatted_date = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
      dateStyle: "medium",
    }).format(message.created_at);

    if (!user.is_member) {
      message.username = "*".repeat(message.username.length);
      message.formatted_date = "*".repeat(message.formatted_date.length);
    }

    return message;
  });

  return res.render("index", { user: req.user, messages });
});

app.use("/sign-up", signUpRouter);
app.use("/log-in", loginRouter);
app.use("/log-out", logoutRouter);
app.use("/new-message", checkAuthenticated, newMessageRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Example app listening on port ${PORT}`);
});
