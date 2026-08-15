import { body } from "express-validator";

const requiredErr = "is required.";

const firstnameValidation = body("first_name")
  .trim()
  .notEmpty()
  .withMessage(`First Name ${requiredErr}`)
  .isLength({ max: 100 });

const lastnameValidation = body("last_name")
  .trim()
  .notEmpty()
  .withMessage(`Last Name ${requiredErr}`)
  .isLength({ max: 100 });

const usernameValidation = body("username")
  .trim()
  .notEmpty()
  .withMessage(`Username ${requiredErr}`)
  .isLength({ min: 3, max: 100 })
  .withMessage("Username must be at least 3 characters long.");

const passwordValidation = body("password")
  .notEmpty()
  .withMessage(`Password ${requiredErr}`)
  .isLength({ min: 6, max: 100 })
  .withMessage("Password must be at least 6 character long.");

const confirmPasswordValidation = body("confirm_password")
  .notEmpty()
  .withMessage(`Cofirm Password ${requiredErr}`)
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't match.");
    }
    return true;
  });

const validateSignUp = [
  firstnameValidation,
  lastnameValidation,
  usernameValidation,
  passwordValidation,
  confirmPasswordValidation,
];

const validateLogIn = [usernameValidation, passwordValidation];

export { validateSignUp, validateLogIn };
