import express from "express";
import { validationResult, matchedData } from "express-validator";

import { validateLogIn } from "../validators/authValidator.js";
import passport from "passport";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.render("login", { data: {}, errors: {} });
});

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { password, ...formData } = req.body;
    return res
      .status(400)
      .render("login", { data: formData, errors: errors.mapped() });
  }

  next();
};

loginRouter.post(
  "/",
  validateLogIn,
  checkValidation,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
);

export default loginRouter;
