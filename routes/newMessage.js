import express from "express";
import { matchedData } from "express-validator";

import { body } from "express-validator";
import checkValidation from "../middleware/checkValidationMiddleware.js";

const newMessageRouter = express.Router();

const validateMessage = [
  body("message_title")
    .trim()
    .notEmpty()
    .withMessage("Message title is required"),
  body("message_content").notEmpty().withMessage("Message content is required"),
];

newMessageRouter.get("/", (req, res) => {
  res.render("new-message");
});

newMessageRouter.post(
  "/",
  validateMessage,
  checkValidation("new-message"),
  (req, res) => {
    const data = matchedData(req);
    console.log(
      `New message from ${req.user.username}: ${data.message_content}`
    );
    res.redirect("/");
  }
);

export default newMessageRouter;
