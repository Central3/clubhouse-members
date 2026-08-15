import express from "express";
import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";

import { registerUser } from "../database/query.js";

const signUpRouter = express.Router();
const requiredErr = "is required.";

const validateUser = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First Name ${requiredErr}`)
    .isLength({ max: 100 }),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last Name ${requiredErr}`)
    .isLength({ max: 100 }),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${requiredErr}`)
    .isLength({ min: 3, max: 100 })
    .withMessage("Username must be at least 3 characters long."),
  body("password")
    .notEmpty()
    .withMessage(`Password ${requiredErr}`)
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 character long."),
  body("confirm_password")
    .notEmpty()
    .withMessage(`Cofirm Password ${requiredErr}`)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match.");
      }
      return true;
    }),
];

signUpRouter.get("/", (req, res) => {
  res.render("sign-up", { data: {}, errors: {} });
});

signUpRouter.post("/", validateUser, async (req, res) => {
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
  res.redirect("/sign-up");
});

export default signUpRouter;
