import express from "express";
import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";

import { registerUser } from "../database/query.js";
import { validateSignUp } from "../validators/authValidator.js";

const signUpRouter = express.Router();

signUpRouter.get("/", (req, res) => {
  res.render("sign-up", { data: {}, errors: {} });
});

signUpRouter.post("/", validateSignUp, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { password, confirm_password, ...formData } = req.body;
    return res
      .status(400)
      .render("sign-up", { data: formData, errors: errors.mapped() });
  }

  const data = matchedData(req);

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const { password, confirm_password, ...user } = data;
  await registerUser(user, hashedPassword);
  res.redirect("/log-in");
});

export default signUpRouter;
