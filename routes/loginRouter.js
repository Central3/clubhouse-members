import express from "express";
import passport from "passport";

import { validateLogIn } from "../validators/authValidator.js";
import checkValidation from "../middleware/checkValidationMiddleware.js";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.render("login", { data: {}, errors: {} });
});

loginRouter.post(
  "/",
  validateLogIn,
  checkValidation("login"),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
);

export default loginRouter;
